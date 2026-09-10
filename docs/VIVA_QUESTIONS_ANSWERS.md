# Fixora Comprehensive Viva Examination Guide
## 30+ Technical Questions & Model Answers for Viva / Demo
**Project Owner / Administrator:** Madhuri Shewale (`madhurishewale078@gmail.com`)
**Project Name:** FIXORA — “Diagnose First. Book Only When Needed.”

---

### Q1: What is the core Unique Selling Proposition (USP) of Fixora?
**Answer:** Fixora's USP is **“Diagnose First. Book Only When Needed.”** Unlike conventional platforms that force immediate technician booking, Fixora intervenes with a safe, structured AI troubleshooting decision tree. If an issue is a safe DIY fix (e.g. cleaning an AC filter mesh or flipping a tripped MCB), users solve it for free. If hazardous or complex, Fixora passes the pre-diagnosed ticket to a verified technician.

---

### Q2: Why did you choose FastAPI over Flask or Django for the backend?
**Answer:**
1. **High Performance & Asynchronous Support:** FastAPI is built on Starlette and Uvicorn, achieving benchmark speeds comparable to Node.js and Go.
2. **Automatic Data Validation:** Deep integration with Pydantic ensures compile-time and runtime validation of request bodies and query parameters.
3. **Interactive Documentation:** Automatically generates OpenAPI 3.0 schemas and Swagger UI (`/docs`), eliminating manual documentation overhead.
4. **Dependency Injection System:** Elegant DI for database sessions, JWT token extraction, and role verification.

---

### Q3: Why React 19 + Vite for the frontend?
**Answer:**
1. **Component Reusability:** Modular architecture for Modals, Status Badges, Star Ratings, and Maps.
2. **Blazing Fast HMR:** Vite utilizes native ES modules, compiling in milliseconds compared to legacy Webpack bundles.
3. **Optimized Virtual DOM:** Efficient diffing algorithm minimizes layout thrashing.
4. **Clean Ecosystem:** Seamless integration with Tailwind CSS and Framer Motion for modern glassmorphic aesthetics.

---

### Q4: How is Role-Based Access Control (RBAC) implemented securely?
**Answer:** We implement defense-in-depth:
1. Server-side enforcement using FastAPI dependency `require_role(["ADMIN", ...])` which decodes the cryptographically signed JWT token.
2. Never trusting client-supplied role claims.
3. Frontend route guarding using `<ProtectedRoute allowedRoles={['...']}>` which intercepts unauthorized URL tampering.

---

### Q5: How are technician approvals handled? Can an unapproved technician log in?
**Answer:** Upon registration, technician profiles are assigned a `status = 'PENDING'`. The authentication router actively checks this status during login: if `PENDING`, `REJECTED`, or `SUSPENDED`, login fails with HTTP 403 Forbidden. Only the Administrator (Madhuri Shewale) can transition status to `APPROVED`, unlocking technician privileges.

---

### Q6: Explain how passwords are stored and verified.
**Answer:** Plaintext passwords are never stored. We utilize `bcrypt` with adaptive work factor (salt rounds). The salt prevents rainbow table attacks, and the slow hash function mitigates offline brute-force attacks.

---

### Q7: How does the AI Troubleshooting Engine work?
**Answer:** It uses an extensible `TroubleshootingEngine` architecture implementing directed acyclic graphs (DAGs). Each node represents a non-technical symptom query, and edges represent user choices leading either to child questions, a `SAFE_RESOLVED` terminal node with DIY steps, or a `TECHNICIAN_REQUIRED` node with estimated costs.

---

### Q8: What safety rules govern the troubleshooting engine?
**Answer:** Under no circumstances will Fixora recommend manipulating live high-voltage wiring (230V mains), bypassing safety fuses, or disassembling refrigerant compressor piping. Hazardous symptoms immediately route to verified professionals.

---

### Q9: How is the booking lifecycle enforced?
**Answer:** We implement a finite state machine (FSM) backed by a transition dictionary:
- `PENDING` -> `ACCEPTED` | `REJECTED` | `CANCELLED`
- `ACCEPTED` -> `IN_PROGRESS` | `CANCELLED`
- `IN_PROGRESS` -> `COMPLETED`
Invalid jumps (such as moving straight from `PENDING` to `COMPLETED`) are rejected with HTTP 400.

---

### Q10: How does Fixora prevent duplicate reviews?
**Answer:** The `reviews` table enforces a `UNIQUE(booking_id)` constraint. Furthermore, the endpoint verifies that `booking.status == 'COMPLETED'` and that the calling user matches `booking.customer_id`.

---

### Q11: How is the technician's aggregate star rating calculated?
**Answer:** Upon review submission, the backend queries `func.avg(Review.rating)` for that technician and updates `technician_profiles.rating` and `total_reviews` in the same atomic transaction.

---

### Q12: How are customer complaints escalated?
**Answer:** Customers can file a complaint against any booking. This creates a ticket (`CMP-YYYYMM-XXXX`) in `complaints`, triggers an admin alert, and remains in `OPEN` or `IN_REVIEW` status until resolved with an official admin statement.

---

### Q13: How is Dark Mode implemented?
**Answer:** Using a dedicated `ThemeContext` that persists preference in `localStorage` and toggles the `dark` class on `document.documentElement`. Tailwind CSS utility classes dynamically adjust contrast, borders, and glass effects.

---

### Q14: How does Fixora integrate maps without expensive Google Maps API keys?
**Answer:** We integrate **Leaflet** coupled with **OpenStreetMap** tile layers. This provides interactive coordinate selection, service radius rendering, and marker dragging with zero vendor lock-in or recurring billing.

---

### Q15: How does Fixora ensure database reliability between development and production?
**Answer:** SQLAlchemy ORM abstraction allows effortless switching between PostgreSQL in production and SQLite in isolated test environments with pool pre-ping connection validation.

---

### Q16: What happens if the primary PostgreSQL service stops?
**Answer:** The database configuration module traps connection exceptions and gracefully falls back to a local SQLite database (`sqlite:///./fixora.db`), ensuring zero downtime during classroom demos or viva reviews.

---

### Q17: How is booking history audited?
**Answer:** Every state change creates an immutable row in `booking_status_history`, recording previous status, new status, the executing user ID, optional notes, and timestamps.

---

### Q18: What are the main tables in the Fixora database schema?
**Answer:** `users`, `customer_profiles`, `technician_profiles`, `service_categories`, `services`, `technician_services`, `bookings`, `booking_status_history`, `troubleshooting_sessions`, `notifications`, `reviews`, and `complaints`.

---

### Q19: How are notifications triggered?
**Answer:** As side-effects within core domain transactions (e.g. technician registration -> admin notification, booking acceptance -> customer notification, service completion -> review prompt).

---

### Q20: Can a customer book a technician outside their trade?
**Answer:** No. Backend validation checks the `technician_services` association table to verify that the target technician supports the requested service before creating the booking.

---

### Q21: What is the purpose of JWT expiration?
**Answer:** Mitigating token theft risks. If a token is compromised, its access automatically expires after 24 hours (`ACCESS_TOKEN_EXPIRE_MINUTES`).

---

### Q22: Why use Pydantic v2 schemas?
**Answer:** For strict input/output serialization, stripping unwanted internal attributes (like password hashes) before sending JSON to the browser.

---

### Q23: How are CORS issues avoided?
**Answer:** `CORSMiddleware` in FastAPI explicitly whitelists trusted origins (e.g. `http://localhost:5173`) allowing credentialed headers and standard HTTP verbs.

---

### Q24: How does the admin monitor revenue?
**Answer:** The admin analytics endpoint computes `func.sum(Booking.final_amount)` across all `COMPLETED` bookings alongside monthly trends.

---

### Q25: Can an admin accidentally deactivate themselves?
**Answer:** No. The `toggle_user_active` endpoint explicitly blocks deactivation of accounts where `role == 'ADMIN'`.

---

### Q26: How does Fixora support future external LLM integration?
**Answer:** The `TroubleshootingEngine` interface decouples the state traversal from the underlying recommendation logic, allowing plug-and-play LLM adapters (e.g. Gemini API) with rule-based safety fallbacks.

---

### Q27: How is soft-delete implemented?
**Answer:** Users have an `is_active` boolean flag. Deactivation disables login and booking visibility without breaking foreign key integrity in historical bookings.

---

### Q28: How does the technician know what the customer diagnosed?
**Answer:** The diagnostic summary is attached to the booking ticket under `diagnosis_summary`, allowing the technician to arrive equipped with proper parts.

---

### Q29: What is the structure of the booking number?
**Answer:** `FX-YYYYMM-XXXX` (Fixora prefix + YearMonth timestamp + random 6-character hex string) ensuring collision resistance and human readability.

---

### Q30: What is the command to run the backend and frontend locally?
**Answer:**
- Backend: `uvicorn app.main:app --reload --port 8000`
- Frontend: `npm run dev`
