import datetime
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, Table, Enum
from sqlalchemy.orm import relationship
from app.database import Base

# Many-to-Many association for Technician & Services
technician_services = Table(
    'technician_services',
    Base.metadata,
    Column('technician_id', Integer, ForeignKey('technician_profiles.id', ondelete='CASCADE'), primary_key=True),
    Column('service_id', Integer, ForeignKey('services.id', ondelete='CASCADE'), primary_key=True)
)

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    role = Column(String(50), default='CUSTOMER', nullable=False)  # 'CUSTOMER', 'TECHNICIAN', 'ADMIN'
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    # Relationships
    customer_profile = relationship('CustomerProfile', back_populates='user', uselist=False, cascade='all, delete-orphan')
    technician_profile = relationship('TechnicianProfile', back_populates='user', uselist=False, cascade='all, delete-orphan')
    notifications = relationship('Notification', back_populates='user', cascade='all, delete-orphan')


class CustomerProfile(Base):
    __tablename__ = 'customer_profiles'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)
    address = Column(String(500), nullable=True)
    city = Column(String(100), default='Pune')
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship('User', back_populates='customer_profile')
    bookings = relationship('Booking', back_populates='customer')
    reviews = relationship('Review', back_populates='customer')
    complaints = relationship('Complaint', back_populates='customer')


class ServiceCategory(Base):
    __tablename__ = 'service_categories'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(100), default='Wrench')
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    services = relationship('Service', back_populates='category', cascade='all, delete-orphan')
    technicians = relationship('TechnicianProfile', back_populates='category')


class Service(Base):
    __tablename__ = 'services'

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey('service_categories.id', ondelete='CASCADE'), nullable=False)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    price_estimate_min = Column(Float, default=299.0)
    price_estimate_max = Column(Float, default=999.0)
    icon = Column(String(100), default='Tool')
    duration_estimate = Column(String(50), default='45-60 mins')
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    category = relationship('ServiceCategory', back_populates='services')
    bookings = relationship('Booking', back_populates='service')
    technicians = relationship('TechnicianProfile', secondary=technician_services, back_populates='services')


class TechnicianProfile(Base):
    __tablename__ = 'technician_profiles'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)
    category_id = Column(Integer, ForeignKey('service_categories.id', ondelete='SET NULL'), nullable=True)
    experience_years = Column(Integer, default=1)
    service_area = Column(String(255), default='Pune Central')
    address = Column(String(500), nullable=True)
    city = Column(String(100), default='Pune')
    latitude = Column(Float, default=18.5204)
    longitude = Column(Float, default=73.8567)
    bio = Column(Text, nullable=True)
    status = Column(String(50), default='PENDING', nullable=False)  # 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'
    rating = Column(Float, default=5.0)
    total_reviews = Column(Integer, default=0)
    total_jobs = Column(Integer, default=0)
    hourly_rate = Column(Float, default=400.0)
    avatar_url = Column(String(500), nullable=True)
    rejection_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship('User', back_populates='technician_profile')
    category = relationship('ServiceCategory', back_populates='technicians')
    services = relationship('Service', secondary=technician_services, back_populates='technicians')
    bookings = relationship('Booking', back_populates='technician')
    reviews = relationship('Review', back_populates='technician')
    complaints = relationship('Complaint', back_populates='technician')


class Booking(Base):
    __tablename__ = 'bookings'

    id = Column(Integer, primary_key=True, index=True)
    booking_number = Column(String(50), unique=True, index=True, nullable=False)
    customer_id = Column(Integer, ForeignKey('customer_profiles.id', ondelete='CASCADE'), nullable=False)
    technician_id = Column(Integer, ForeignKey('technician_profiles.id', ondelete='CASCADE'), nullable=False)
    service_id = Column(Integer, ForeignKey('services.id', ondelete='CASCADE'), nullable=False)
    problem_description = Column(Text, nullable=False)
    diagnosis_summary = Column(Text, nullable=True)
    address = Column(String(500), nullable=False)
    city = Column(String(100), default='Pune')
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    preferred_date = Column(String(50), nullable=False)
    preferred_time = Column(String(50), nullable=False)
    status = Column(String(50), default='PENDING', nullable=False)  # PENDING, ACCEPTED, IN_PROGRESS, COMPLETED, REJECTED, CANCELLED
    estimated_cost = Column(Float, default=499.0)
    final_amount = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    customer = relationship('CustomerProfile', back_populates='bookings')
    technician = relationship('TechnicianProfile', back_populates='bookings')
    service = relationship('Service', back_populates='bookings')
    history = relationship('BookingStatusHistory', back_populates='booking', cascade='all, delete-orphan')
    review = relationship('Review', back_populates='booking', uselist=False, cascade='all, delete-orphan')
    complaints = relationship('Complaint', back_populates='booking', cascade='all, delete-orphan')


class BookingStatusHistory(Base):
    __tablename__ = 'booking_status_history'

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey('bookings.id', ondelete='CASCADE'), nullable=False)
    previous_status = Column(String(50), nullable=True)
    new_status = Column(String(50), nullable=False)
    changed_by_user_id = Column(Integer, ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    booking = relationship('Booking', back_populates='history')


class TroubleshootingSession(Base):
    __tablename__ = 'troubleshooting_sessions'

    id = Column(Integer, primary_key=True, index=True)
    session_token = Column(String(100), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='SET NULL'), nullable=True)
    problem_key = Column(String(100), nullable=False)
    history_json = Column(Text, default='[]')
    final_outcome = Column(String(50), default='IN_PROGRESS')  # SAFE_RESOLVED, TECHNICIAN_REQUIRED, IN_PROGRESS
    recommended_service_id = Column(Integer, ForeignKey('services.id', ondelete='SET NULL'), nullable=True)
    diagnosis_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class Notification(Base):
    __tablename__ = 'notifications'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default='INFO')  # BOOKING, APPROVAL, REVIEW, COMPLAINT, SYSTEM
    link_url = Column(String(255), nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship('User', back_populates='notifications')


class Review(Base):
    __tablename__ = 'reviews'

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey('bookings.id', ondelete='CASCADE'), unique=True, nullable=False)
    customer_id = Column(Integer, ForeignKey('customer_profiles.id', ondelete='CASCADE'), nullable=False)
    technician_id = Column(Integer, ForeignKey('technician_profiles.id', ondelete='CASCADE'), nullable=False)
    rating = Column(Integer, nullable=False)  # 1 to 5
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    booking = relationship('Booking', back_populates='review')
    customer = relationship('CustomerProfile', back_populates='reviews')
    technician = relationship('TechnicianProfile', back_populates='reviews')


class Complaint(Base):
    __tablename__ = 'complaints'

    id = Column(Integer, primary_key=True, index=True)
    complaint_number = Column(String(50), unique=True, index=True, nullable=False)
    booking_id = Column(Integer, ForeignKey('bookings.id', ondelete='CASCADE'), nullable=False)
    customer_id = Column(Integer, ForeignKey('customer_profiles.id', ondelete='CASCADE'), nullable=False)
    technician_id = Column(Integer, ForeignKey('technician_profiles.id', ondelete='CASCADE'), nullable=False)
    subject = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(50), default='OPEN')  # OPEN, IN_REVIEW, RESOLVED, CLOSED
    admin_response = Column(Text, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    booking = relationship('Booking', back_populates='complaints')
    customer = relationship('CustomerProfile', back_populates='complaints')
    technician = relationship('TechnicianProfile', back_populates='complaints')
