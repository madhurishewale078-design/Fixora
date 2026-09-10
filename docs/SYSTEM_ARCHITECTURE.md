# System Architecture & Diagrams
## FIXORA: “Diagnose First. Book Only When Needed.”
**Lead Engineer / Admin:** Madhuri Shewale (`madhurishewale078@gmail.com`)

---

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph ClientLayer ["Client Layer (Presentation)"]
        UI["React 19 + TypeScript + Tailwind CSS"]
        Theme["ThemeContext (Light / Dark)"]
        AuthCtx["AuthContext (JWT Session)"]
        Leaflet["Leaflet + OpenStreetMap"]
    end

    subgraph APILayer ["API & Business Logic (FastAPI)"]
        Router["FastAPI REST Routers (/api/v1)"]
        AuthModule["Auth & RBAC Middleware (bcrypt / JWT)"]
        AIEngine["AI Troubleshooting Engine (Decision Trees)"]
        BookingSM["Booking State Machine Controller"]
        NotifEngine["Automated Notification Dispatcher"]
    end

    subgraph DataLayer ["Data & Persistence Layer"]
        ORM["SQLAlchemy ORM (Connection Pool)"]
        Postgres["PostgreSQL / SQLite Database"]
    end

    UI --> Router
    Router --> AuthModule
    Router --> AIEngine
    Router --> BookingSM
    Router --> NotifEngine
    AuthModule --> ORM
    AIEngine --> ORM
    BookingSM --> ORM
    NotifEngine --> ORM
    ORM --> Postgres
```

---

## 2. Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USERS ||--o| CUSTOMER_PROFILES : "has"
    USERS ||--o| TECHNICIAN_PROFILES : "has"
    USERS ||--o{ NOTIFICATIONS : "receives"
    SERVICE_CATEGORIES ||--o{ SERVICES : "contains"
    SERVICE_CATEGORIES ||--o{ TECHNICIAN_PROFILES : "categorizes"
    
    CUSTOMER_PROFILES ||--o{ BOOKINGS : "places"
    TECHNICIAN_PROFILES ||--o{ BOOKINGS : "accepts"
    SERVICES ||--o{ BOOKINGS : "specifies"
    
    BOOKINGS ||--o{ BOOKING_STATUS_HISTORY : "tracks"
    BOOKINGS ||--o| REVIEWS : "generates"
    BOOKINGS ||--o{ COMPLAINTS : "escalates"
    
    TECHNICIAN_PROFILES ||--o{ TECHNICIAN_SERVICES : "offers"
    SERVICES ||--o{ TECHNICIAN_SERVICES : "linked_to"

    USERS {
        int id PK
        string email UK
        string hashed_password
        string full_name
        string phone
        string role
        boolean is_active
        datetime created_at
    }

    TECHNICIAN_PROFILES {
        int id PK
        int user_id FK
        int category_id FK
        int experience_years
        string service_area
        string status
        float rating
        int total_jobs
        float hourly_rate
    }

    BOOKINGS {
        int id PK
        string booking_number UK
        int customer_id FK
        int technician_id FK
        int service_id FK
        string status
        float estimated_cost
        float final_amount
        string preferred_date
        string preferred_time
    }
```

---

## 3. Data Flow Diagrams (DFD)

### 3.1 DFD Level 0 (Context Diagram)

```mermaid
flowchart TD
    Customer["Customer"]
    Technician["Technician"]
    Admin["Admin (Madhuri Shewale)"]
    FixoraSystem["FIXORA Core Platform"]

    Customer -->|1. Problem Symptoms / Diagnosis Request| FixoraSystem
    FixoraSystem -->|2. Safe Guidance OR Recommendation| Customer
    Customer -->|3. Service Booking Request| FixoraSystem

    FixoraSystem -->|4. Job Alerts & Booking Details| Technician
    Technician -->|5. Accept / Progress / Complete Job| FixoraSystem

    FixoraSystem -->|6. Technician Registration & Complaints| Admin
    Admin -->|7. Approvals / Suspensions / Resolutions| FixoraSystem
```

### 3.2 DFD Level 1 (Decomposition Diagram)

```mermaid
flowchart TD
    User["Customer / Technician"] -->|Credentials| P1["1.0 Authentication & RBAC"]
    P1 -->|JWT Session| TokenStore["Token Store"]

    Customer["Customer"] -->|Select Symptom| P2["2.0 AI Diagnostic Engine"]
    P2 -->|Rule Traversal| RuleDB[("Troubleshooting Rules")]
    P2 -->|DIY Steps or Matched Service| Customer

    Customer -->|Booking Request| P3["3.0 Booking Lifecycle Machine"]
    P3 -->|Validate Status| BookingDB[("Bookings Database")]
    P3 -->|Event Trigger| P4["4.0 Notification Dispatcher"]
    P4 -->|Push Alerts| Technician["Technician"]

    Technician -->|Accept / Update Status| P3
    Customer -->|Star Rating & Comment| P5["5.0 Review & Complaint System"]
    P5 -->|Recalculate Averages| ReviewDB[("Reviews & Complaints")]
```

---

## 4. Use Case Diagram

```mermaid
flowchart LR
    subgraph Users ["Actors"]
        C["Customer"]
        T["Technician"]
        A["Admin (Madhuri Shewale)"]
    end

    subgraph UseCases ["Fixora Platform Capabilities"]
        UC1["Self-Guided AI Diagnosis"]
        UC2["Search Verified Technicians"]
        UC3["Book Home Service"]
        UC4["Submit Star Rating & Review"]
        UC5["Raise Service Complaint"]

        UC6["Apply as Technician (Pending Gate)"]
        UC7["Accept / Decline Bookings"]
        UC8["Update Service Status"]
        UC9["View Earnings & Ratings"]

        UC10["Verify / Approve Technicians"]
        UC11["Monitor Live Bookings"]
        UC12["Resolve Customer Disputes"]
        UC13["Oversee Revenue & Analytics"]
    end

    C --> UC1
    C --> UC2
    C --> UC3
    C --> UC4
    C --> UC5

    T --> UC6
    T --> UC7
    T --> UC8
    T --> UC9

    A --> UC10
    A --> UC11
    A --> UC12
    A --> UC13
```
