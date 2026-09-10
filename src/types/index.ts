export type Role = 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN';
export type TechnicianStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
export type BookingStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED' | 'CANCELLED';
export type ComplaintStatus = 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'CLOSED';

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  role: Role;
  customer_id?: number;
  technician_id?: number;
  status?: TechnicianStatus;
  service_area?: string;
  category_name?: string;
  rating?: number;
  address?: string;
  city?: string;
}

export interface Service {
  id: number;
  category_id: number;
  name: string;
  description?: string;
  price_estimate_min: number;
  price_estimate_max: number;
  icon: string;
  duration_estimate: string;
  is_active: boolean;
}

export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon: string;
  is_active: boolean;
  services: Service[];
}

export interface Technician {
  id: number;
  user_id: number;
  full_name: string;
  email: string;
  phone?: string;
  category_name?: string;
  category_id?: number;
  experience_years: number;
  service_area: string;
  address?: string;
  city: string;
  latitude?: number;
  longitude?: number;
  bio?: string;
  status: TechnicianStatus;
  rating: number;
  total_reviews: number;
  total_jobs: number;
  hourly_rate: number;
  avatar_url?: string;
  rejection_reason?: string;
  services: Service[];
  created_at: string;
}

export interface Booking {
  id: number;
  booking_number: string;
  customer_id: number;
  technician_id: number;
  service_id: number;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  technician_name?: string;
  technician_phone?: string;
  service_name?: string;
  category_name?: string;
  problem_description: string;
  diagnosis_summary?: string;
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  preferred_date: string;
  preferred_time: string;
  status: BookingStatus;
  estimated_cost: number;
  final_amount?: number;
  created_at: string;
  completed_at?: string;
  has_review?: boolean;
  has_complaint?: boolean;
  status_history?: {
    previous_status?: string;
    new_status: string;
    notes?: string;
    created_at: string;
  }[];
}

export interface TroubleshootingQuestion {
  id: string;
  text: string;
  explanation: string;
  options: {
    id: string;
    text: string;
    next: string;
  }[];
}

export interface TroubleshootingSession {
  session_token: string;
  problem_key: string;
  problem_title: string;
  current_question?: TroubleshootingQuestion;
  is_completed: boolean;
  outcome?: 'SAFE_RESOLVED' | 'TECHNICIAN_REQUIRED';
  outcome_title?: string;
  guidance?: string;
  steps?: string[];
  price_estimate?: string;
  recommended_service?: {
    id: number;
    name: string;
    category_name: string;
    price_estimate_min: number;
    price_estimate_max: number;
    icon: string;
  };
  history?: {
    question_id: string;
    question_text: string;
    selected_option_id: string;
    selected_option_text: string;
  }[];
}

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: string;
  link_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface ReviewItem {
  id: number;
  booking_id: number;
  customer_name: string;
  technician_name: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export interface ComplaintItem {
  id: number;
  complaint_number: string;
  booking_id: number;
  customer_id: number;
  customer_name: string;
  technician_id: number;
  technician_name: string;
  subject: string;
  description: string;
  status: ComplaintStatus;
  admin_response?: string;
  resolved_at?: string;
  created_at: string;
}

export interface AdminAnalytics {
  total_customers: number;
  total_technicians: number;
  pending_technicians: number;
  approved_technicians: number;
  total_bookings: number;
  pending_bookings: number;
  active_bookings: number;
  completed_bookings: number;
  cancelled_bookings: number;
  total_complaints: number;
  open_complaints: number;
  total_reviews: number;
  average_rating: number;
  total_revenue_estimate: number;
  recent_bookings: any[];
  category_distribution: { name: string; count: number; icon: string }[];
  monthly_trend: { month: string; bookings: number; revenue: number }[];
}
