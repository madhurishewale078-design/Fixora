-- FIXORA Demo Seed Script (PostgreSQL / SQLite)
-- Concept: 'Diagnose First. Book Only When Needed.'

-- Admin Account: Madhuri Shewale (Email: madhurishewale078@gmail.com)
-- Note: Password hash corresponds to Admin@Fixora2025 using bcrypt.
INSERT INTO users (email, hashed_password, full_name, phone, role, is_active)
VALUES 
('madhurishewale078@gmail.com', '$2b$12$N8q3MqvT8f9d0G7YhN7v9.4U90tqZ2j8bB6K8/V3k1vK4l3v2j4e.', 'Madhuri Shewale', '+91 98765 43210', 'ADMIN', TRUE)
ON CONFLICT (email) DO NOTHING;

-- Service Categories
INSERT INTO service_categories (name, slug, description, icon, is_active)
VALUES
('Electrician', 'electrician', 'Fan repair, switchboard replacement, MCB wiring, and appliance circuits.', 'Zap', TRUE),
('Plumber', 'plumber', 'Leakage detection, tap cartridges, flush cisterns, and pipeline overhaul.', 'Droplets', TRUE),
('AC Repair', 'ac-repair', 'Split/Window AC foam servicing, compressor capacitors, and gas refills.', 'Snowflake', TRUE),
('RO Water Purifier', 'ro-service', 'Filter candle changes, membrane scaling, and TDS calibration.', 'Activity', TRUE),
('Carpenter', 'carpenter', 'Door locks, hydraulic hinges, furniture assembly, and wooden repairs.', 'Hammer', TRUE),
('Appliance Repair', 'appliance-repair', 'Washing machines, microwaves, and refrigerator cooling circuits.', 'Tv', TRUE)
ON CONFLICT (slug) DO NOTHING;
