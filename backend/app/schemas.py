from typing import Optional, List, Any, Dict
from pydantic import BaseModel, EmailStr
from datetime import datetime

# --- Auth & User ---
class Token(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    user: Dict[str, Any]

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class CustomerRegister(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    password: str
    address: Optional[str] = None
    city: Optional[str] = 'Pune'

class TechnicianRegister(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    password: str
    category_id: int
    experience_years: int
    service_area: str
    address: Optional[str] = None
    city: Optional[str] = 'Pune'
    bio: Optional[str] = None
    hourly_rate: Optional[float] = 400.0

class UserOut(BaseModel):
    id: int
    email: str
    full_name: str
    phone: Optional[str] = None
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    bio: Optional[str] = None
    service_area: Optional[str] = None
    hourly_rate: Optional[float] = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

# --- Service & Category ---
class ServiceOut(BaseModel):
    id: int
    category_id: int
    name: str
    description: Optional[str] = None
    price_estimate_min: float
    price_estimate_max: float
    icon: str
    duration_estimate: str
    is_active: bool

    class Config:
        from_attributes = True

class ServiceCategoryOut(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    icon: str
    is_active: bool
    services: List[ServiceOut] = []

    class Config:
        from_attributes = True

class ServiceCreate(BaseModel):
    category_id: int
    name: str
    description: Optional[str] = None
    price_estimate_min: float = 299.0
    price_estimate_max: float = 999.0
    icon: Optional[str] = 'Tool'
    duration_estimate: Optional[str] = '45-60 mins'

class CategoryCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = 'Wrench'

# --- Technician Profile ---
class TechnicianOut(BaseModel):
    id: int
    user_id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    category_name: Optional[str] = None
    category_id: Optional[int] = None
    experience_years: int
    service_area: str
    address: Optional[str] = None
    city: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    bio: Optional[str] = None
    status: str
    rating: float
    total_reviews: int
    total_jobs: int
    hourly_rate: float
    avatar_url: Optional[str] = None
    services: List[ServiceOut] = []
    created_at: datetime

    class Config:
        from_attributes = True

class TechnicianStatusUpdate(BaseModel):
    status: str  # APPROVED, REJECTED, SUSPENDED
    rejection_reason: Optional[str] = None

# --- Troubleshooting Engine ---
class TroubleshootingAnswer(BaseModel):
    session_token: str
    question_id: str
    selected_option_id: str

class TroubleshootingStartRequest(BaseModel):
    problem_key: str

class TroubleshootingSessionOut(BaseModel):
    session_token: str
    problem_key: str
    current_question: Optional[Dict[str, Any]] = None
    is_completed: bool = False
    outcome: Optional[str] = None  # SAFE_RESOLVED or TECHNICIAN_REQUIRED
    guidance: Optional[str] = None
    steps: Optional[List[str]] = None
    recommended_service: Optional[Dict[str, Any]] = None
    price_estimate: Optional[str] = None

# --- Bookings ---
class BookingCreate(BaseModel):
    technician_id: int
    service_id: int
    problem_description: str
    diagnosis_summary: Optional[str] = None
    address: str
    city: Optional[str] = 'Pune'
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    preferred_date: str
    preferred_time: str
    estimated_cost: Optional[float] = None

class BookingStatusUpdate(BaseModel):
    status: str  # ACCEPTED, IN_PROGRESS, COMPLETED, REJECTED, CANCELLED
    notes: Optional[str] = None
    final_amount: Optional[float] = None

class BookingOut(BaseModel):
    id: int
    booking_number: str
    customer_id: int
    technician_id: int
    service_id: int
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    customer_email: Optional[str] = None
    technician_name: Optional[str] = None
    technician_phone: Optional[str] = None
    service_name: Optional[str] = None
    category_name: Optional[str] = None
    problem_description: str
    diagnosis_summary: Optional[str] = None
    address: str
    city: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    preferred_date: str
    preferred_time: str
    status: str
    estimated_cost: float
    final_amount: Optional[float] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    has_review: bool = False
    has_complaint: bool = False

    class Config:
        from_attributes = True

# --- Reviews ---
class ReviewCreate(BaseModel):
    booking_id: int
    rating: int  # 1 to 5
    comment: Optional[str] = None

class ReviewOut(BaseModel):
    id: int
    booking_id: int
    customer_name: str
    technician_name: str
    rating: int
    comment: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- Complaints ---
class ComplaintCreate(BaseModel):
    booking_id: int
    subject: str
    description: str

class ComplaintResponse(BaseModel):
    status: str  # IN_REVIEW, RESOLVED, CLOSED
    admin_response: str

class ComplaintOut(BaseModel):
    id: int
    complaint_number: str
    booking_id: int
    customer_id: int
    customer_name: str
    technician_id: int
    technician_name: str
    subject: str
    description: str
    status: str
    admin_response: Optional[str] = None
    resolved_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

# --- Notifications ---
class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    type: str
    link_url: Optional[str] = None
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- Admin Analytics ---
class AdminAnalytics(BaseModel):
    total_customers: int
    total_technicians: int
    pending_technicians: int
    approved_technicians: int
    total_bookings: int
    pending_bookings: int
    active_bookings: int
    completed_bookings: int
    cancelled_bookings: int
    total_complaints: int
    open_complaints: int
    total_reviews: int
    average_rating: float
    total_revenue_estimate: float
    recent_bookings: List[Dict[str, Any]] = []
    category_distribution: List[Dict[str, Any]] = []
    monthly_trend: List[Dict[str, Any]] = []
