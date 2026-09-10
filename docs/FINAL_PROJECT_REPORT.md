# FINAL YEAR ACADEMIC PROJECT REPORT
# FIXORA: AI-ASSISTED SMART HOME SERVICE PLATFORM
## Tagline: “Diagnose First. Book Only When Needed.”

---
**Project Lead & Administrator:** Madhuri Shewale  
**Email:** madhurishewale078@gmail.com  
**Academic Degree:** Bachelor of Engineering (Computer Engineering)  
**Date of Submission:** September 2026  
---

## TABLE OF CONTENTS
1. Abstract
2. Introduction
3. Problem Statement
4. Existing System Analysis
5. Proposed System (Fixora)
6. Objectives & Expected Outcomes
7. Project Scope & Boundary
8. Unique Selling Proposition (USP)
9. User Roles & Stakeholder Profiles
10. Functional Requirements
11. Non-Functional Requirements
12. System Architecture & Component Design
13. Detailed Module Descriptions
14. Database Design & Entity Relationships
15. Entity-Relationship (ER) Modeling
16. Data Flow Diagrams (DFD Level 0, 1, 2)
17. Use Case Analysis & Actor Specifications
18. API Architecture & RESTful Endpoints
19. AI Troubleshooting Engine & Safety Rules
20. Security Architecture & Threat Modeling
21. Verification & Testing Methodology
22. UI/UX Design System & Dark Mode
23. Advantages of Fixora
24. Limitations & Constraints
25. Future Scope & Research Directions
26. Conclusion
27. References & Standards

---

## 1. Abstract
Home maintenance services face persistent challenges including non-transparent pricing, unneeded physical visits for minor issues, and technicians arriving unprepared without required replacement components. This report presents **FIXORA**, a full-stack, AI-assisted platform built upon the foundational principle: *“Diagnose First. Book Only When Needed.”* Fixora deploys an intelligent diagnostic decision engine to evaluate symptoms across electrical, plumbing, AC, RO, and appliance domains. Non-hazardous faults are resolved through guided DIY steps at zero expense, while complex issues are routed to verified, skill-matched local technicians with pre-populated diagnostic notes. Built using React 19, TypeScript, Tailwind CSS, FastAPI, and PostgreSQL, Fixora establishes a reliable, secure, and production-grade paradigm for modern domestic service platforms.

## 2. Introduction
Urban households regularly experience equipment breakdowns ranging from simple tripped circuit breakers to refrigerant leaks. Most consumers lack the technical background to distinguish between simple fixes and critical faults. Fixora creates a trusted intermediary that empowers the user with structured safe diagnostics while ensuring field technicians are deployed only when physical expertise is genuinely necessary.

## 3. Problem Statement
Contemporary on-demand home service applications operate primarily as directory dispatchers. When an issue occurs, the user is immediately prompted to book a technician. Studies indicate that up to 32% of domestic call-outs could be resolved by the homeowner safely (e.g., reset switches, cleaned filters, reseated drain hoses). Furthermore, without prior diagnosis, technicians frequently lack the required spare parts on first arrival, necessitating multiple visits.

## 4. Existing System Analysis
Existing platforms (e.g. Urban Company, TaskRabbit) prioritize visit volume over preliminary problem resolution. They lack interactive diagnostic decision trees and offer minimal transparency regarding what a technician will inspect upon arrival.

## 5. Proposed System (Fixora)
Fixora inverts this model:
1. Interactive fault interrogation using non-technical questions.
2. Immediate evaluation: Safe DIY resolution vs. Professional intervention.
3. Pre-populated service booking with diagnostic context attached.
4. Strict administrative verification gate for service partners.
5. End-to-end booking state machine with audit history.

## 6. Objectives & Expected Outcomes
- Reduce unnecessary domestic service calls by over 30%.
- Ensure 100% adherence to electrical and physical safety guidelines.
- Provide transparent pricing estimates before booking confirmation.
- Guarantee that only vetted, approved technicians operate on the platform.

## 7. Project Scope & Boundary
The scope encompasses domestic household repairs in urban centers (demonstrated in Pune, India). Real-time GPS tracking is supported via OpenStreetMap and Leaflet radius mapping.

## 8. Unique Selling Proposition (USP)
Fixora’s hallmark USP is **“Diagnose First. Book Only When Needed.”** This positioning creates consumer trust, reduces unnecessary household expenditure, and provides technicians with high-value, qualified service requests.

## 9. User Roles & Stakeholder Profiles
- **Customer:** Residential homeowners requiring home repairs.
- **Technician:** Skilled tradespeople providing certified services.
- **Admin (Madhuri Shewale):** Governance authority managing platform integrity, approvals, complaints, and analytics.

## 10. Functional Requirements
Detailed in SRS (authentication, diagnosis, booking state machine, notifications, reviews, complaints, and admin oversight).

## 11. Non-Functional Requirements
Sub-200ms API response latency, responsive UI supporting all viewports, automated database fallback resilience, and WCAG AA contrast compliance in Light and Dark modes.

## 12. System Architecture & Component Design
Three-tier client-server architecture utilizing RESTful JSON communication, JWT session tokens, and relational database persistence via SQLAlchemy ORM.

## 13. Detailed Module Descriptions
- **Diagnostic Engine:** Rule traversal and safety barrier enforcement.
- **Booking Machine:** Manages state progression (`PENDING` -> `ACCEPTED` -> `IN_PROGRESS` -> `COMPLETED`).
- **Review Module:** Aggregate rating recalculation with duplicate prevention.
- **Complaint Escalation:** Administrative dispute mediation.

## 14. Database Design & Entity Relationships
Normalized relational architecture with foreign key constraints, cascading deletions on user profiles, and indexing on high-frequency search fields.

## 15. Entity-Relationship (ER) Modeling
Documented with full Mermaid notation in `SYSTEM_ARCHITECTURE.md`.

## 16. Data Flow Diagrams (DFD)
Includes Level 0 Context, Level 1 Functional, and Level 2 Process Decomposition diagrams.

## 17. Use Case Analysis & Actor Specifications
Actor interaction models capturing customer booking, technician status updates, and administrative approvals.

## 18. API Architecture & RESTful Endpoints
Conforms to OpenAPI 3.0 specification with documented request/response contracts for all CRUD operations.

## 19. AI Troubleshooting Engine & Safety Rules
Deterministic directed acyclic graph implementation ensuring absolute electrical safety (zero live wire or hazardous compressor access instructions).

## 20. Security Architecture & Threat Modeling
bcrypt hashing, signed JWT tokens with 24-hour expiry, role-based route protection, parameterized queries preventing SQL injection, and environment variable secret isolation.

## 21. Verification & Testing Methodology
Unit, integration, and end-to-end testing covering authentication gates, status transitions, review constraints, and cross-browser rendering.

## 22. UI/UX Design System & Dark Mode
Tailwind CSS glassmorphism, responsive navigation, persistent theme state, and animated micro-interactions using Framer Motion and Lucide icons.

## 23. Advantages of Fixora
Cost savings for homeowners, higher efficiency for technicians, zero platform spam through admin vetting, and high-trust community reviews.

## 24. Limitations & Constraints
Requires internet access for diagnostics; physical repairs remain dependent on technician punctuality and spare parts availability.

## 25. Future Scope & Research Directions
Integration of multimodal vision models (e.g. Gemini Vision API) for photo-based damage analysis, IoT sensor hookups, and multi-lingual regional voice interactions.

## 26. Conclusion
Fixora delivers an innovative, practical, and highly scalable platform that bridges home maintenance and modern AI diagnostics, setting a benchmark for final-year engineering projects.

## 27. References & Standards
- RFC 7519: JSON Web Token (JWT)
- W3C Web Content Accessibility Guidelines (WCAG) 2.1
- FastAPI and Starlette Documentation
- React 19 and Vite Engineering Documentation
