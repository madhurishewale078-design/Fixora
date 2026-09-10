# FIXORA Presentation Deck (15 Slides)
## Slide Content & Talking Points for Final Year Presentation
**Project Owner / Administrator:** Madhuri Shewale (`madhurishewale078@gmail.com`)
**Project Title:** FIXORA — “Diagnose First. Book Only When Needed.”

---

### Slide 1: Title Slide
- **Title:** FIXORA
- **Subtitle:** AI-Assisted Smart Home Service & Diagnostic Platform
- **Tagline:** “Diagnose First. Book Only When Needed.”
- **Project Lead:** Madhuri Shewale
- **Academic Year:** Final Year Engineering Project

---

### Slide 2: The Problem Statement
- Unnecessary technician call-outs for minor issues (e.g. tripped breakers, blocked aerator meshes).
- Unpredictable, non-transparent pricing and surprise charges.
- Lack of pre-visit diagnosis forces technicians to make multiple trips for parts.
- General consumer anxiety when dealing with domestic electrical and plumbing faults.

---

### Slide 3: The Fixora Solution
- **Diagnose First:** An intelligent diagnosis wizard interrogates symptoms before scheduling visits.
- **Safe DIY Empowerment:** Non-hazardous issues solved immediately with step-by-step guidance.
- **Verified Technician Network:** Professional handoff with pre-filled diagnosis summaries.
- **Role-Centric Platform:** Dedicated workspaces for Customers, Technicians, and Admin.

---

### Slide 4: Core USP & Architectural Flow
```
CUSTOMER PROBLEM
      ↓
AI TROUBLESHOOTING (Decision Tree)
      ↓
Can the issue be resolved safely?
      ↓
[YES] → Guided DIY Steps → Problem Solved! (Zero Cost)
[NO]  → Recommend Technician → Fixed Pricing Range → Match Verified Partner
```

---

### Slide 5: Key System Features
- **Intelligent Diagnostics:** Multi-path decision trees for Fan, AC, Plumbing, RO, and Appliance faults.
- **Technician Verification Gate:** Strict Admin approval (`PENDING` -> `APPROVED`).
- **Finite State Booking Lifecycle:** Enforces valid status transitions.
- **Interactive Geo-Location:** Leaflet + OpenStreetMap radius visualization.
- **Quality Feedback Loop:** Star ratings, duplicate review prevention, and dispute resolution.

---

### Slide 6: Three Role Ecosystem
1. **Customer:** Run diagnosis, search verified partners, track appointments, rate services.
2. **Technician:** View pre-diagnosed tickets, accept/decline jobs, progress status, track earnings.
3. **Administrator (Madhuri Shewale):** Approve/suspend technicians, audit bookings, resolve complaints.

---

### Slide 7: Technology Stack
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Framer Motion, Leaflet.
- **Backend:** Python 3.12, FastAPI, Pydantic v2, Uvicorn.
- **Persistence:** PostgreSQL with SQLite resilient fallback, SQLAlchemy ORM.
- **Security:** bcrypt password hashing, JWT HS256 tokens, OAuth2 Bearer guards.

---

### Slide 8: Database Design & Relationships
- 12 normalized relational entities with cascading referential integrity.
- `users` → `customer_profiles` / `technician_profiles`.
- `bookings` with complete `booking_status_history` audit trail.
- `reviews` enforcing one review per completed booking.

---

### Slide 9: AI Troubleshooting Architecture
- Clean abstraction interface: `TroubleshootingEngine`.
- Rule-based Directed Acyclic Graph (DAG) ensuring 100% deterministic safety.
- Strict electrical safety rules: Zero high-voltage live wire manipulation allowed.
- Future-ready adapter interface for large language model (LLM) integration.

---

### Slide 10: Security & Access Control
- Passwords salted and hashed with `bcrypt`.
- JWT claims containing subject and role with 24-hour expiration.
- Server-side dependency injection enforces RBAC on all mutation endpoints.
- Environment variable separation prevents credential leakage.

---

### Slide 11: Technician Verification & Booking Lifecycle
```
Technician Registers → PENDING → Admin Reviews → APPROVED
                                              ↳ REJECTED
Customer Books → PENDING → ACCEPTED → IN PROGRESS → COMPLETED
                     ↳ REJECTED / CANCELLED
```

---

### Slide 12: Admin Operations & Analytics
- Live metrics: Total Users, Active Jobs, Pending Approvals, Estimated Revenue.
- 1-Click technician management: Approve, Reject with reason, Suspend, Activate.
- Customer account control and dispute management.

---

### Slide 13: Live Demonstration Highlights
- AI Diagnosis of a ceiling fan issue resulting in safe DIY MCB instructions.
- AI Diagnosis of an AC gas leak recommending technician with pre-filled booking.
- Technician accepting job and completing service workflow.
- Admin portal reviewing analytics and resolving customer complaint.

---

### Slide 14: Future Scope & Roadmap
- Integration with external multimodal LLMs (e.g. Gemini Vision for camera-based fault detection).
- Real-time technician GPS tracking using WebSockets.
- IoT integration with smart home breaker panels and smart meters.
- Multi-lingual regional voice assistant support.

---

### Slide 15: Conclusion
- Fixora proves that upfront AI diagnosis reduces unnecessary visits, boosts consumer trust, and streamlines field technician efficiency.
- Tagline: *“Diagnose First. Book Only When Needed.”*
- **Q&A Session.**
