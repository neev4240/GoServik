# GoServik System Architecture & Operational Documentation

Welcome to the **GoServik** partner and service marketplace platform. This document outlines the application file structures, system operations, role-based boundaries, service search logic, and the financial/operational model of the platform.

---

## 1. Development Files & Core Structure

GoServik is built on a modern **React 18** and **Vite** single-page application framework, utilizing **TypeScript** for strict type safety and **Tailwind CSS** for an elegant, high-contrast, professional visual layout.

### Key Directory Structure:
*   `src/types.ts`: Holds shared global interfaces and enums including `User`, `ProfessionalProfile`, `Service`, `Booking`, and `Category`.
*   `src/store.ts`: The central client-side reactive state engine managing user authentication, saved experts, active/past bookings, live chat messages, and service updates.
*   `src/App.tsx`: Manages routing configurations, guarding pages from unauthorized access, and housing main route definitions.
*   `src/pages/`:
    *   `Home.tsx`: Visual gateway with catalog links, onboarding routes, and brand introductions.
    *   `Explore.tsx`: Search-enabled page showcasing categorical service cards.
    *   `BookingFlow.tsx`: Fluid booking wizard managing appointment dates, time slots, payment methods, and landmarks.
    *   `ProfessionalPortal.tsx`: Explicit informational and landing hub dedicated purely to professionals and onboarding criteria.
    *   `Auth.tsx` / `AuthProfessional.tsx`: Handles separate login/registration forms for customers and professional partners.
    *   `Dashboard.tsx`: Central hub that dynamically renders the appropriate dashboard panel depending on the authenticated role.
*   `src/components/dashboard/`:
    *   `CustomerDashboardView.tsx`: Active customer dashboard for booking tracking, personal profile settings, support tickets, and live support chat.
    *   `ProfessionalDashboardView.tsx`: Verified partner portal for managing booking requests, publishing new service parameters, updating business status, and direct customer messages.
    *   `AdminDashboardView.tsx`: Platform summary, professional partner verification logs, and preference updates.

---

## 2. Dynamic Service Keywords Search Logic

To support flexible and intuitive service searches, discoverability in `src/pages/Explore.tsx` is powered by two distinct matching mechanisms:

1.  **Direct Category & Sub-option Matching**: Filters and displays categories where either the title or the precise sub-option (e.g. "Geyser Inspection") matches the user's search query.
2.  **Extended Keywords Dictionary (`keywordsByCategory`)**: A dictionary mapping related shorthand terms and synonyms to categories. For example:
    *   Searching `"leak"` or `"blockage"` instantly discovers **Plumbing & Pipe Repair**.
    *   Searching `"short circuit"`, `"wire"`, or `"fuse"` maps to **Electrical Services**.
    *   Searching `"fridge"` or `"dryer"` maps to **Appliance Repair**.
    *   Searching `"pest"`, `"lizard"`, or `"insect"` maps to **Pest Control**.

---

## 3. Strict Account Boundaries & Authentication Rules

To prevent booking confusion, eliminate pricing exploitation, and ensure platform safety, GoServik enforces rigid operational separation between Customers and Professional Partners:

*   **Distinct Login Desks**: Professionals must register and authenticate strictly through the designated **Professional Portal** and Partner Login Desk.
*   **No Dual Role Registrations**: A registered Professional profile is hard-restricted from logging in as or registering a customer account. The authentication routes immediately redirect them with an *Access Restricted* panel to prevent account crossover.
*   **No Booking Privileges for Partners**: Professional credentials cannot be used to book plumbing, cleaning, electrical, or any domestic services. They operate strictly as providers.
*   **One Phone Number Constraint**: A physical mobile number can only be linked to a single role on the network.

---

## 4. Platform Model & Financial Flow

GoServik operates under a standardized diagnostics-first model. This structure guarantees pricing clarity and professional service scheduling:

*   **Standardized Booking Parameter**: Booking requests are established based on standard slot-based availability. This prevents scheduling overlap and eliminates pricing bidding.
*   **Diagnostic Visit Fee**: All initial bookings on the platform carry a flat, standardized visit fee (e.g., ₹99) to secure scheduling, cover transit diagnostics, and designate a certified local specialist. 
*   **On-Site Custom Estimates**: After the technician arrives, performs a physical diagnostic, and estimates material or complex labor requirements, any additional service charges are computed and settled directly on-site.
