# FIXORA — AI-Assisted Smart Home Service Platform
> **“Diagnose First. Book Only When Needed.”**

Fixora is a production-grade, full-stack smart home service web application engineered with an intelligent preliminary diagnosis layer. Rather than forcing consumers to schedule expensive technician visits for minor issues, Fixora troubleshoots symptoms through interactive, non-hazardous decision trees. Safe items are guided to DIY resolution for free, while critical issues are routed directly to verified local professionals with pre-filled diagnosis summaries.

---

## 🌟 Executive Project Overview
- **Project Lead / Administrator:** Madhuri Shewale (`madhurishewale078@gmail.com`)
- **Primary Core USP:** *“Diagnose First. Book Only When Needed.”*
- **Target Audience:** Urban households, certified home service technicians, and municipal service administrators.
- **Academic Standard:** Engineered as a comprehensive, presentation-ready final year engineering capstone project.

---

## 🚀 Key Features

### 1. 🧠 AI-Assisted Troubleshooting Assistant (Flagship USP)
- Structured diagnostic trees covering **Ceiling Fans**, **AC Cooling**, **Plumbing & Water Leakages**, **RO Water Purifiers**, and **Home Appliances**.
- **Absolute Safety Protocol:** Strictly prevents hazardous suggestions (e.g. manipulating live 230V circuits or sealed compressor coils).
- **Outcomes:** Step-by-step non-hazardous DIY resolution (with celebration confetti) OR transparent technician recommendation with estimated cost ranges and handoff notes.

### 2. 👥 Three-Tier Role-Based Architecture
- **Customer:** Interactive diagnosis, browse verified services, book technicians with Leaflet map location picker, track booking statuses, submit ratings, and log complaints.
- **Technician:** Professional portal, verification badge, incoming booking requests (`Accept` / `Decline`), active service state machine (`Start Service` -> `Mark Completed`), and earnings tracking.
- **Admin (Madhuri Shewale):** Platform analytics, 1-click technician approval gate (`Approve`, `Reject`, `Suspend`, `Activate`), customer management, booking oversight, and dispute resolution.

### 3. 🔒 Strict Security & Verification Gate
- Newly registered technicians enter a mandatory **`PENDING`** state and are strictly blocked from logging in or receiving bookings until approved by the Administrator.
- Passwords cryptographically hashed using **`bcrypt`**.
- Stateless authentication powered by signed **JSON Web Tokens (JWT)** with 24-hour expiration.
- Server-side dependency injection enforces Role-Based Access Control (RBAC).

### 4. 🔄 Finite State Booking Lifecycle
- Enforces valid state machine transitions:
  `PENDING` ➔ `ACCEPTED` ➔ `IN_PROGRESS` ➔ `COMPLETED` (or `REJECTED`, `CANCELLED`).
- Immutable audit log in `booking_status_history` tracking actor IDs and timestamps.

### 5. 🔔 Automated In-App Notifications
- Real-time notification drawer with unread badges triggered automatically on booking submissions, status updates, technician approvals, review reminders, and complaints.

### 6. ⭐ Quality Control & Feedback Loop
- 1-to-5 star ratings and reviews permitted only for `COMPLETED` bookings.
- Unique database constraint prevents duplicate reviews.
- Technician aggregate ratings automatically recalculate upon review submission.
- Comprehensive customer complaint escalation and resolution portal.

### 7. 🌗 Modern UI/UX with Light & Dark Mode
- Full dual-theme styling powered by `ThemeContext` and Tailwind CSS, persisted in `localStorage`.
- Leaflet + OpenStreetMap integration for interactive coordinate selection and service radius mapping.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Framer Motion, Leaflet, Canvas Confetti |
| **Backend** | Python 3.12, FastAPI, Pydantic v2, Uvicorn, Passlib / Bcrypt, Python-JOSE |
| **Database** | PostgreSQL (Primary) with automatic fallback to SQLite (`sqlite:///./fixora.db`), SQLAlchemy ORM |
| **Documentation**| OpenAPI 3.0 / Swagger UI, Postman v2.1 Collection, Markdown SRS & Academic Reports |

---

## 📂 Project Structure

```
smart-home-fix/
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   │   ├── engine.py           # TroubleshootingEngine abstraction & DAG runner
│   │   │   └── rules.py            # Structured diagnostic decision trees & safety rules
│   │   ├── routers/
│   │   │   ├── admin.py            # Analytics, approvals, complaints, user management
│   │   │   ├── auth.py             # Login, register (Customer & Tech), profile, password
│   │   │   ├── bookings.py         # Booking creation & strict state machine controller
│   │   │   ├── complaints.py       # Customer dispute escalation & resolution
│   │   │   ├── notifications.py    # In-app notification dispatcher & badge count
│   │   │   ├── reviews.py          # Ratings calculation & duplicate review prevention
│   │   │   ├── services.py         # Categories, services, verified technician directory
│   │   │   └── troubleshooting.py  # Diagnostic session initiation & step traversal
│   │   ├── auth.py                 # Direct bcrypt hashing & JWT token verification
│   │   ├── config.py               # Pydantic Settings & environment variables
│   │   ├── database.py             # SQLAlchemy engine with resilient SQLite fallback
│   │   ├── main.py                 # FastAPI application & CORS configuration
│   │   ├── models.py               # Relational database models (12 tables)
│   │   └── schemas.py              # Pydantic request/response validation schemas
│   ├── seed.py                     # Idempotent database population script
│   ├── requirements.txt            # Python dependencies
│   ├── .env                        # Local development environment configuration
│   └── .env.example                # Example environment template
├── database/
│   ├── schema.sql                  # Normalized PostgreSQL DDL schema with indexes
│   └── seed.sql                    # Initial SQL insert statements
├── docs/
│   ├── SRS.md                      # Complete Software Requirements Specification
│   ├── SYSTEM_ARCHITECTURE.md      # Mermaid diagrams (ER, DFD Level 0/1/2, Use Cases)
│   ├── FINAL_PROJECT_REPORT.md     # 27-chapter final year academic capstone report
│   ├── PPT_PRESENTATION_CONTENT.md # 15-slide presentation deck
│   └── VIVA_QUESTIONS_ANSWERS.md   # 30+ technical questions & model viva answers
├── postman/
│   └── FIXORA_API_Collection.json  # Complete Postman collection with all role endpoints
├── src/                            # React 19 Frontend source code
│   ├── api/client.ts               # Fetch API client with JWT interceptor
│   ├── components/                 # Modals, Navbar, Footer, ThemeToggle, MapPicker, Badges
│   ├── context/                    # AuthContext and ThemeContext
│   ├── pages/                      # Home, AIAssistant, Services, Technicians, Dashboards
│   └── types/                      # Comprehensive TypeScript interfaces
├── public/                         # Static assets and SVG favicon
├── package.json                    # Frontend dependencies & scripts
├── tailwind.config.js              # Tailwind configuration with dark mode support
└── README.md                       # Master project documentation
```

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
- **Node.js**: v18+ or v20+ (`node --version`)
- **Python**: v3.10+ (`python3 --version`)
- **PostgreSQL** (Optional — auto-fallback to SQLite will run automatically if PostgreSQL is inactive)

---

### 2. Backend Setup
```bash
cd backend

# Create virtual environment (optional)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scriptsctivate

# Install dependencies
pip install -r requirements.txt

# Run the idempotent database migration & seed script
python3 seed.py

# Start FastAPI backend server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
- API Base URL: `http://127.0.0.1:8000`
- Interactive Swagger UI: `http://127.0.0.1:8000/docs`

---

### 3. Frontend Setup
Open a second terminal window:
```bash
cd ..  # Project root

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
- Frontend Application URL: `http://localhost:5173`

---

## 🔑 Demo Accounts & Quick-Login Buttons
The login page (`/login`) includes **One-Click Viva Demo Buttons** to instantly sign in without typing:

| Role | Name | Email | Password | Status / Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | Madhuri Shewale | `madhurishewale078@gmail.com` | `Admin@Fixora2025` | Full platform authority & analytics |
| **Customer** | Rahul Sharma | `rahul.sharma@example.com` | `User@12345` | Active customer with past bookings |
| **Technician (Approved)** | Rajesh Kumar | `rajesh.electrician@example.com` | `Tech@12345` | Master Electrician (Pune) |
| **Technician (Pending)** | Dinesh Pawar | `dinesh.pawar@example.com` | `Tech@12345` | Tests that unapproved tech is blocked |

---

## 🚢 Deployment Instructions (Railway / Render / Vercel)

### Backend Deployment (e.g. Railway or Render)
1. Set Root Directory: `backend`
2. Build Command: `pip install -r requirements.txt`
3. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Environment Variables:
   - `DATABASE_URL`: Your production PostgreSQL connection string.
   - `SECRET_KEY`: A secure 32-byte random string.
   - `ADMIN_EMAIL`: `madhurishewale078@gmail.com`
   - `ADMIN_PASSWORD`: Your secret admin password.
   - `BACKEND_CORS_ORIGINS`: Your production frontend domain URL.

### Frontend Deployment (e.g. Vercel or Netlify)
1. Set Root Directory: Root (`.`)
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-backend-service.railway.app/api/v1`

---

## 🎓 Academic Documentation Package
For academic submissions and project defense, refer to the following comprehensive documents located in `docs/`:
1. [Software Requirements Specification (SRS)](docs/SRS.md)
2. [System Architecture & Mermaid Diagrams](docs/SYSTEM_ARCHITECTURE.md)
3. [Final Year 27-Chapter Academic Project Report](docs/FINAL_PROJECT_REPORT.md)
4. [15-Slide Presentation Deck](docs/PPT_PRESENTATION_CONTENT.md)
5. [30+ Viva Examination Questions & Answers](docs/VIVA_QUESTIONS_ANSWERS.md)
6. [Postman API Collection](postman/FIXORA_API_Collection.json)

---

## 📄 License & Attribution
Designed, developed, and maintained by **Madhuri Shewale** for academic and professional demonstration.  
Tagline: *“Diagnose First. Book Only When Needed.”*
