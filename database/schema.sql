-- FIXORA Relational Database Schema DDL
-- Concept: 'Diagnose First. Book Only When Needed.'

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'CUSTOMER' NOT NULL, -- 'CUSTOMER', 'TECHNICIAN', 'ADMIN'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customer_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    address VARCHAR(500),
    city VARCHAR(100) DEFAULT 'Pune',
    latitude FLOAT,
    longitude FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS service_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100) DEFAULT 'Wrench',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES service_categories(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price_estimate_min FLOAT DEFAULT 299.0,
    price_estimate_max FLOAT DEFAULT 999.0,
    icon VARCHAR(100) DEFAULT 'Tool',
    duration_estimate VARCHAR(50) DEFAULT '45-60 mins',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS technician_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES service_categories(id) ON DELETE SET NULL,
    experience_years INTEGER DEFAULT 1,
    service_area VARCHAR(255) DEFAULT 'Pune Central',
    address VARCHAR(500),
    city VARCHAR(100) DEFAULT 'Pune',
    latitude FLOAT DEFAULT 18.5204,
    longitude FLOAT DEFAULT 73.8567,
    bio TEXT,
    status VARCHAR(50) DEFAULT 'PENDING' NOT NULL, -- 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'
    rating FLOAT DEFAULT 5.0,
    total_reviews INTEGER DEFAULT 0,
    total_jobs INTEGER DEFAULT 0,
    hourly_rate FLOAT DEFAULT 400.0,
    avatar_url VARCHAR(500),
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS technician_services (
    technician_id INTEGER REFERENCES technician_profiles(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    PRIMARY KEY (technician_id, service_id)
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id INTEGER REFERENCES customer_profiles(id) ON DELETE CASCADE,
    technician_id INTEGER REFERENCES technician_profiles(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    problem_description TEXT NOT NULL,
    diagnosis_summary TEXT,
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100) DEFAULT 'Pune',
    latitude FLOAT,
    longitude FLOAT,
    preferred_date VARCHAR(50) NOT NULL,
    preferred_time VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING' NOT NULL, -- 'PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'REJECTED', 'CANCELLED'
    estimated_cost FLOAT DEFAULT 499.0,
    final_amount FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS booking_status_history (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS troubleshooting_sessions (
    id SERIAL PRIMARY KEY,
    session_token VARCHAR(100) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    problem_key VARCHAR(100) NOT NULL,
    history_json TEXT DEFAULT '[]',
    final_outcome VARCHAR(50) DEFAULT 'IN_PROGRESS',
    recommended_service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
    diagnosis_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'INFO',
    link_url VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    customer_id INTEGER REFERENCES customer_profiles(id) ON DELETE CASCADE,
    technician_id INTEGER REFERENCES technician_profiles(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS complaints (
    id SERIAL PRIMARY KEY,
    complaint_number VARCHAR(50) UNIQUE NOT NULL,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    customer_id INTEGER REFERENCES customer_profiles(id) ON DELETE CASCADE,
    technician_id INTEGER REFERENCES technician_profiles(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'OPEN',
    admin_response TEXT,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_technicians_status ON technician_profiles(status);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_number ON bookings(booking_number);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
