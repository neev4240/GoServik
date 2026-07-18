# GoServik System Architecture & Technical Documentation

Welcome to the **GoServik** engineering and system documentation. This document serves as a complete technical guide for other team members to understand the codebase, data schemas, service flows, integration layers, and operational frameworks.

---

## 1. System Overview & Core Workflow

GoServik is a highly scalable, real-time, hyperlocal on-demand service aggregator that connects Customers needing household maintenance with verified local Professional Partners across **16 structured service categories**.

### The Hyperlocal Match Workflow
```
[Customer selects a Subcategory]
         │
         ▼
[Inputs Address & Pinpoints Coordinates on Google Map]
         │
         ▼
[System queries partners within the Pincode / Radius]
         │
         ▼
[Customer Schedules Slot & Pays Visit Booking Fee]
         │
         ▼
[Booking Instantly Synchronized in Cloud Firestore]
         │
         ▼
[Partner notified via Real-Time Partner Portal Desk]
```

---

## 2. File Architecture Directory

Below is the structured registry of files that drive GoServik:

### 📂 Configuration Files
* `/index.html`: Web application wrapper. Configured with metadata, SEO indexes, responsive screen viewports, and custom document title set to **GoServik**.
* `/vite.config.ts`: Vite bundler configuration. Injected with `define` blocks to securely expose the `process.env.GOOGLE_MAPS_PLATFORM_KEY` to browser components at build-time.
* `/.env.example`: Template for environment variables. Documents the required environment keys like `GOOGLE_MAPS_PLATFORM_KEY` and Firebase credentials.
* `/firestore.rules`: Declarative security rules governing database collections.

### 📂 App Shell & Core State
* `/src/main.tsx`: Entry point mounting React with strict runtime modules.
* `/src/App.tsx`: Central router mapping customer dashboards, partner portals, booking pathways, and administrator panels.
* `/src/store.ts`: The unified **Zustand** state engine. Manages user sessions, local data mirroring, and implements real-time client-to-cloud bidirectional synchronization with **Cloud Firestore**.

### 📂 Global Pages & Portals
* `/src/pages/Auth.tsx`: **The Unified Auth Portal**. Houses the client-side login and registration components for both Customers and Partners. Implements role checks and prevents cross-role login collisions.
* `/src/pages/AuthProfessional.tsx`: Backward-compatible proxy module routing legacy links into the unified Auth component.
* `/src/pages/Dashboard.tsx`: Primary consumer screen featuring category listings, active orders, and historical booking logs.
* `/src/pages/BookingFlow.tsx`: Multi-step checkout funnel managing dynamic subcategory checklist arrays, address details, and coordinates capture.
* `/src/pages/ProfessionalPortal.tsx`: Dedicated Partner Desk with job boards, status workflows, and profile settings.
* `/src/pages/AdminPanel.tsx`: High-level operational dashboard for monitoring partners, active bookings, and category logs.

### 📂 Custom Components
* `/src/components/GoogleMapPicker.tsx`: **Precision Mapping Component**. Uses Google Maps Platform React wrappers. Detects key presence, supports geocoding queries, and falls back gracefully to standard OpenStreetMap/Leaflet maps when keys are pending setup.
* `/src/components/ui/Button.tsx`: Highly reusable custom display button conforming to our modern visual guidelines.

---

## 3. Financial Working Model

GoServik operates under an optimized financial model designed to generate recurring platform maintenance revenue while giving local partners full job matching flexibility.

### A. GoServik Platform Visit Booking Fee (Our Revenue)
* **Visit Collection Policy**: When a Customer schedules any booking, they pay a nominal **Platform Visit Fee** (default: `₹99` / `$99` based on region).
* **Platform Retention**: **All initial visit booking fees are fully retained on-platform as GoServik Platform Revenue.** This visit fee is dedicated to cover the cost of background checks, system upkeep, and hyperlocal coordinate matching services.
* **Payout Boundary**: 
  * No part of the visit booking fee is transferred, credited, or distributed to the Professional Partners. 
  * The Professional Partners are registered on GoServik as independent third-party contractors and are aware that visit booking fees are platform-retained.

### B. Offline Service Contracts & Partner Quotations
* **Quotations**: The actual repair labor and physical material costs are negotiated directly between the Customer and the Partner during the physical home visit.
* **Direct Billing**: Customers pay the Partner directly for all offline labor, parts replacements, or custom installations. The platform does not intervene or claim commission on these offline material transactions, providing a transparent, flat-fee listing model.

---

## 4. Hyperlocal Precision Mapping

Hyperlocal matching uses a **Dual-Engine Precision Map Picker** (`GoogleMapPicker.tsx`) to capture coordinate locations without relying on brittle geolocation defaults:

1. **Google Maps Platform (`@vis.gl/react-google-maps`)**:
   * Utilizes the **Geocoder API** to resolve entered addresses into exact `{ lat, lng }` coordinates.
   * Relocates the map automatically when an address is typed.
   * Allows the user to click or drag on the map to pinpoint the exact structural location (e.g., apartment wing, garage gate).
   * Passes the required internal attribution ID: `gmp_mcp_codeassist_v1_aistudio`.
2. **OpenStreetMap/Leaflet Fallback Engine**:
   * Uses the OpenStreetMap Nominatim API to fetch coordinates without requiring client API key setup.
   * Displays the map and permits coordinate pinpointing, ensuring the app remains fully robust even if the platform secret is not yet configured.

---

## 5. Security Rules & Data Model

Database security rules are declared in `/firestore.rules` and protect user documents from cross-role manipulation:

### 🗄️ Collections & Schema Specifications

#### 1. Customers (`/customers/{userId}`)
```json
{
  "id": "string (cust-id)",
  "name": "string",
  "email": "string",
  "mobile": "string",
  "role": "customer",
  "joinedAt": "timestampISO",
  "coordinates": { "lat": "number", "lng": "number" },
  "city": "string",
  "pincode": "string"
}
```

#### 2. Professionals (`/professionals/{proId}`)
```json
{
  "id": "string (pro-id)",
  "name": "string",
  "email": "string",
  "mobile": "string",
  "role": "professional",
  "verified": "boolean",
  "category": "string (cat-id)",
  "coordinates": { "lat": "number", "lng": "number" },
  "city": "string",
  "pincode": "string",
  "companyName": "string"
}
```

#### 3. Bookings (`/bookings/{bookingId}`)
```json
{
  "id": "string (bk-id)",
  "customerId": "string",
  "status": "pending | accepted | completed | cancelled",
  "totalPrice": "number (Platform Visit Fee)",
  "createdAt": "timestampISO",
  "customerName": "string",
  "customerMobile": "string",
  "customerAddress": "string",
  "customerServiceOpted": "string",
  "coordinates": { "lat": "number", "lng": "number" },
  "date": "string (YYYY-MM-DD)",
  "time": "string (Slot)"
}
```

---

## 6. Authentication Architecture

GoServik implements split-role authentication powered by **Firebase Auth** with client-side guard-rail validation:

1. **Email and Mobile Conversions**:
   * Traditional email/password is supported.
   * Mobile logins are converted to secure virtual email credentials (`+919876543210@goservik.com`) under the hood to leverage Firebase's identity providers.
2. **Anti-Duplication Filter**:
   * When signing up, the system inspects both database indices (Customers & Professionals).
   * A mobile number is restricted to **one unique account**. An account cannot have duplicate mobile linkages across different roles.
3. **Role Cross-Collision Protection**:
   * If an account is registered as a Customer, the login system rejects any attempts to sign in via the Partner Portal toggle, and instructs the user to use the Customer Portal, and vice versa. This preserves structural separation.
