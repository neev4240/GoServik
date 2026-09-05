# KaamNow System Architecture & Technical Documentation

Welcome to the **KaamNow** engineering and system documentation. This document serves as a complete technical guide for understanding the KaamNow marketplace codebase, data schemas, service flows, integration layers, and operational frameworks.

---

## 1. System Overview & Core Workflow

**KaamNow** is a fast, trusted, bilingual marketplace connecting customers with nearby independent skilled professionals across **16 structured service categories**.

* **Brand Core**: "Connect. Book. Sorted."
* **Marketplace Model**: KaamNow is a connector and neutral platform. Professionals are independent service providers, not employees of KaamNow.
* **Languages**: English and Hinglish (हिंग्लिश) toggle available system-wide.

### The Hyperlocal Match Workflow
```
[Customer selects Subcategory]
         │
         ▼
[Inputs Address & Pinpoints Coordinates on Google Map]
         │
         ▼
[System matches nearest verified independent professionals within Radius]
         │
         ▼
[Customer Compares Profiles, Ratings, Experience & Selects Pro]
         │
         ▼
[Diagnostic Visit Fee ₹99 + 5% Marketplace Platform Fee transparently detailed]
         │
         ▼
[Booking Instantly Synchronized in Cloud Firestore & Broadcast to Pro]
         │
         ▼
[Pro Updates Lifecycle: En Route ➔ Arrived ➔ Diagnostics ➔ In Progress ➔ Completed]
         │
         ▼
[Customer Rating & Review + KaamNow Work Protection Guarantee Claims]
```

---

## 2. File Architecture Directory

Below is the structured registry of files that drive KaamNow:

### 📂 Configuration Files
* `/index.html`: Web application wrapper. Configured with metadata, SEO indexes, responsive screen viewports, and title set to **KaamNow | Connect. Book. Sorted.**
* `/vite.config.ts`: Vite bundler configuration. Exposes `GOOGLE_MAPS_PLATFORM_KEY` to client components.
* `/.env.example`: Documents required keys including `GOOGLE_MAPS_PLATFORM_KEY` and Firebase credentials.
* `/firestore.rules`: Security rules governing database collections and role separation.
* `/metadata.json`: Application metadata reflecting KaamNow.

### 📂 App Shell & Core State
* `/src/main.tsx`: Entry point mounting React.
* `/src/App.tsx`: Central router mapping customer dashboards, partner portals, booking pathways, explore directory, and administrative tools.
* `/src/store.ts`: The unified **Zustand** state engine. Manages user sessions, local data mirroring, and implements real-time client-to-cloud bidirectional synchronization with **Cloud Firestore**. Contains `migrateToKaamNow()` database migration logic.

### 📂 Global Pages & Portals
* `/src/pages/Auth.tsx`: **The Unified Auth Portal**. Houses login and registration components for both Customers and Partners. Enforces strict role separation, mobile validation, and Google profile completion.
* `/src/pages/Explore.tsx`: Browse all 16 service categories, filter by city/rating, compare professionals, and initiate direct bookings.
* `/src/pages/Dashboard.tsx`: Primary consumer screen with live booking tracker, review modals, and support.
* `/src/pages/BookingFlow.tsx`: 5-step checkout funnel managing subcategory checklist, Google Maps coordinate capture, professional selection, slot scheduling, and fee breakdown.
* `/src/pages/ProfessionalPortal.tsx`: Dedicated Partner Desk with live broadcast radar, job lifecycle progress, earnings calculator, 5% fee deductions, milestone bonuses, and rating tiers.
* `/src/pages/Admin.tsx`: High-level operational dashboard for monitoring partners, active bookings, category logs, and the 1-click KaamNow database migration tool.
* `/src/pages/StaticPages.tsx`: About KaamNow, Careers, Safety & Trust, Terms of Service, Privacy Policy, and Work Protection Guarantee.

### 📂 Custom Components
* `/src/components/GoogleMapPicker.tsx`: **Dual-Engine Precision Map Picker**. Uses Google Maps Platform React wrappers with geocoding, interactive pin dragging, and OpenStreetMap/Leaflet fallback.
* `/src/components/dashboard/CustomerDashboardView.tsx`: Customer dashboard with live order tracking, chat, and settings.
* `/src/components/dashboard/ProfessionalDashboardView.tsx`: Pro dashboard with radar alerts, status workflow, and milestone rewards.

---

## 3. Financial & Revenue Model

KaamNow operates under a fair, transparent revenue model:

### A. Customer Diagnostic Visit Fee
* Customers pay a nominal **₹99 Diagnostic / Visiting Fee** when booking.
* This covers initial coordination, coordinates verification, and on-site inspection.

### B. Marketplace Commission (5% Platform Fee)
* KaamNow charges a transparent **5% platform fee** on total job billings.
* The independent professional retains **95%** of all earnings.
* Complete breakdown is shown to both customer and professional in their respective views.

### C. Rating-Linked Subscriptions (Starting Q4)
* Free ₹0 registration during the current launch phase.
* Starting in Q4, monthly subscriptions will scale inversely with ratings:
  * **Rating ≥ 4.8**: ₹100/month (Highest tier discount for quality pros)
  * **Rating 4.5 - 4.79**: ₹199/month
  * **Rating 4.0 - 4.49**: ₹299/month
  * **Rating < 4.0**: Standard evaluation tier

### D. Quality Incentives & Milestones
* **10 Jobs**: ₹500 Tool Voucher credit
* **50 Jobs**: Free Premium Spotlight banner in local search
* **100 Jobs**: 0% Platform Fee for 1 full month

### E. KaamNow Work Protection Guarantee
* Protection coverage on eligible bookings against property damage or non-completion.
* Disclaimers explicitly specify KaamNow acts as an introductory marketplace and professionals are independent contractors.

---

## 4. Hyperlocal Precision Mapping

Hyperlocal matching uses a **Dual-Engine Precision Map Picker** (`GoogleMapPicker.tsx`):

1. **Google Maps Platform (`@vis.gl/react-google-maps`)**:
   * Uses Geocoder API to resolve addresses into `{ lat, lng }` coordinates.
   * Pinpoint selection on map drag/click.
   * Attribution tag: `gmp_mcp_codeassist_v1_aistudio`.
2. **OpenStreetMap/Leaflet Fallback Engine**:
   * Automatic fallback if the Google Maps key is unset, maintaining 100% uptime for coordinate pinpointing.

---

## 5. Authentication Architecture

* **Phone and Email Authentication**:
  * Phone numbers are formatted with standard 10-digit Indian mobile validation (+91).
  * Virtual synthetic credentials (`phone@kaamnow.com`) allow seamless Firebase Auth integration.
* **Strict Role Separation**:
  * Customers cannot log into the Professional portal, and vice versa.
  * Same email or phone cannot be registered across opposing roles.
* **Google OAuth Completion Flow**:
  * Google Sign-in automatically checks if mobile and city are completed; prompts first-time users to complete their profile before proceeding.
