# Software Requirements Specification (SRS)
## Project Name: FIXORA
### Tagline: “Diagnose First. Book Only When Needed.”
**Project Owner / Administrator:** Madhuri Shewale (`madhurishewale078@gmail.com`)

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for **FIXORA**, an AI-assisted smart home service platform designed to diagnose household appliance, electrical, plumbing, and HVAC faults before scheduling physical visits. By implementing the core USP: *“Diagnose First. Book Only When Needed.”*, Fixora protects consumers from unnecessary service charges while providing verified local technicians with structured, pre-diagnosed service tickets.

### 1.2 Scope
Fixora encompasses:
- An intelligent rule-based/decision-tree troubleshooting assistant ensuring non-hazardous guidance.
- Role-based authentication (Customer, Technician, Admin) with token-based authorization.
- An admin verification gate for technicians (Pending -> Approved / Rejected / Suspended).
- An end-to-end booking state machine (`PENDING` -> `ACCEPTED` -> `IN_PROGRESS` -> `COMPLETED`).
- An automated in-app notification engine.
- A rating, review, and complaint escalation module.
- Leaflet + OpenStreetMap geo-location support.
- An executive analytics dashboard for platform oversight.

---

## 2. Overall Description

### 2.1 Product Perspective
Fixora bridges the gap between emergency panic bookings and safe DIY guidance. Rather than an open directory or random chatbot, Fixora organizes diagnostic workflows by problem categories, guaranteeing consumer safety and price transparency.

### 2.2 User Roles & Characteristics
1. **Customer:**
   - Registers with location and contact details.
   - Runs interactive diagnostic sessions.
   - Books approved technicians with attached diagnostic summaries.
   - Tracks booking status in real-time, submits reviews, and logs complaints.
2. **Technician:**
   - Registers with trade skill, experience, service area, and hourly rate.
   - Enters a mandatory `PENDING` verification gate.
   - Accesses dashboard only upon administrative approval.
   - Accepts/rejects bookings, transitions job statuses, and tracks earnings.
3. **Administrator (Madhuri Shewale):**
   - Holds absolute platform authority.
   - Approves/rejects/suspends technicians.
   - Monitors platform-wide analytics and booking lifecycles.
   - Resolves customer complaints and moderates reviews.

---

## 3. Functional Requirements

### 3.1 Authentication & Security (SEC-01 - SEC-06)
- **FR-01:** System shall hash passwords using `bcrypt` (minimum 12 rounds) before persisting in the database.
- **FR-02:** System shall issue signed JSON Web Tokens (JWT) using `HS256` with configurable expiration.
- **FR-03:** Protected routes shall enforce role-based access control (RBAC) server-side.
- **FR-04:** Unapproved technicians (`PENDING`, `REJECTED`, `SUSPENDED`) shall be strictly barred from technician endpoints.
- **FR-05:** Sensitive admin passwords and API secrets shall not be exposed in frontend bundles or public repositories.

### 3.2 AI Troubleshooting Assistant (TRB-01 - TRB-05)
- **FR-06:** System shall provide structured decision trees for Ceiling Fans, AC Cooling, Plumbing Leakages, RO Purifiers, etc.
- **FR-07:** Each step must provide a non-technical explanation and non-hazardous response choices.
- **FR-08:** System shall terminate with either `SAFE_RESOLVED` (step-by-step DIY guide) or `TECHNICIAN_REQUIRED` (price estimation and handoff).
- **FR-09:** Safety constraint: System shall strictly prohibit suggesting high-voltage tampering or compressor disassembly.

### 3.3 Booking Lifecycle (BKG-01 - BKG-06)
- **FR-10:** Customers can schedule bookings only with `APPROVED` and active technicians.
- **FR-11:** Bookings must generate a unique tracking identifier (e.g., `FX-YYYYMM-XXXX`).
- **FR-12:** The state machine shall strictly validate allowed transitions:
  - `PENDING` -> `ACCEPTED` | `REJECTED` | `CANCELLED`
  - `ACCEPTED` -> `IN_PROGRESS` | `CANCELLED`
  - `IN_PROGRESS` -> `COMPLETED`
- **FR-13:** Any status update must log an entry in `booking_status_history` with actor ID and timestamp.

### 3.4 Notifications & Feedback (NOT-01 - NOT-04)
- **FR-14:** Status transitions, technician applications, and complaints shall automatically generate in-app notifications.
- **FR-15:** Completed bookings can receive exactly one 1-5 star review; multiple submissions are prevented.
- **FR-16:** Technician aggregate ratings and total jobs must automatically recalculate upon review submission.

---

## 4. Non-Functional Requirements

- **Performance:** API endpoints must respond in < 200ms under standard local load.
- **Availability:** Auto-fallback from PostgreSQL to SQLite ensures 100% test and viva uptime.
- **Usability:** High-contrast Light and Dark mode persisted in `localStorage`.
- **Portability:** Fully containerizable or deployable to Railway, Render, or Vercel.
