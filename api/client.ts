const API_BASE = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1').replace(/\/$/, '');

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('fixora_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = 'An unexpected error occurred';
    try {
      const errorData = await response.json();
      errorDetail = errorData.detail || errorData.message || JSON.stringify(errorData);
    } catch {
      errorDetail = response.statusText;
    }

    if (response.status === 401 && !endpoint.includes('/auth/login')) {
      localStorage.removeItem('fixora_token');
      localStorage.removeItem('fixora_user');
      window.dispatchEvent(new Event('fixora_auth_change'));
    }

    throw new Error(errorDetail);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (credentials: any) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  registerCustomer: (data: any) => apiRequest('/auth/register/customer', { method: 'POST', body: JSON.stringify(data) }),
  registerTechnician: (data: any) => apiRequest('/auth/register/technician', { method: 'POST', body: JSON.stringify(data) }),
  getCurrentUser: () => apiRequest('/auth/me'),
  updateProfile: (data: any) => apiRequest('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
  changePassword: (data: any) => apiRequest('/auth/change-password', { method: 'POST', body: JSON.stringify(data) }),
  forgotPassword: (email: string) => apiRequest('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  // Services
  getCategories: () => apiRequest('/services/categories'),
  getServices: (categoryId?: number) => apiRequest(`/services/items${categoryId ? `?category_id=${categoryId}` : ''}`),
  getTechnicians: (params?: { category_id?: number; service_area?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.category_id) query.append('category_id', params.category_id.toString());
    if (params?.service_area) query.append('service_area', params.service_area);
    if (params?.search) query.append('search', params.search);
    return apiRequest(`/services/technicians?${query.toString()}`);
  },
  getTechnicianDetail: (id: number) => apiRequest(`/services/technicians/${id}`),

  // Troubleshooting
  getTroubleshootProblems: () => apiRequest('/troubleshooting/problems'),
  startTroubleshoot: (problem_key: string) => apiRequest('/troubleshooting/start', { method: 'POST', body: JSON.stringify({ problem_key }) }),
  submitTroubleshootAnswer: (data: { session_token: string; question_id: string; selected_option_id: string }) =>
    apiRequest('/troubleshooting/answer', { method: 'POST', body: JSON.stringify(data) }),

  // Bookings
  createBooking: (data: any) => apiRequest('/bookings', { method: 'POST', body: JSON.stringify(data) }),
  getMyBookings: (statusFilter?: string) => apiRequest(`/bookings/my${statusFilter ? `?status_filter=${statusFilter}` : ''}`),
  getBookingDetail: (id: number) => apiRequest(`/bookings/${id}`),
  updateBookingStatus: (id: number, data: { status: string; notes?: string; final_amount?: number }) =>
    apiRequest(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Notifications
  getNotifications: () => apiRequest('/notifications'),
  getUnreadCount: () => apiRequest('/notifications/unread-count'),
  markNotificationRead: (id: number) => apiRequest(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => apiRequest('/notifications/mark-all-read', { method: 'POST' }),

  // Reviews
  createReview: (data: { booking_id: number; rating: number; comment?: string }) =>
    apiRequest('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  getTechnicianReviews: (technicianId: number) => apiRequest(`/reviews/technician/${technicianId}`),

  // Complaints
  createComplaint: (data: { booking_id: number; subject: string; description: string }) =>
    apiRequest('/complaints', { method: 'POST', body: JSON.stringify(data) }),
  getMyComplaints: () => apiRequest('/complaints/my'),

  // Admin
  getAdminAnalytics: () => apiRequest('/admin/analytics'),
  getAdminTechnicians: (statusFilter?: string) =>
    apiRequest(`/admin/technicians${statusFilter ? `?status_filter=${statusFilter}` : ''}`),
  updateTechnicianStatus: (id: number, data: { status: string; rejection_reason?: string }) =>
    apiRequest(`/admin/technicians/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),
  getAdminCustomers: () => apiRequest('/admin/customers'),
  toggleUserActive: (userId: number) => apiRequest(`/admin/users/${userId}/toggle-active`, { method: 'PATCH' }),
  resolveComplaint: (complaintId: number, data: { status: string; admin_response: string }) =>
    apiRequest(`/admin/complaints/${complaintId}/resolve`, { method: 'PATCH', body: JSON.stringify(data) }),
  moderateReview: (reviewId: number) => apiRequest(`/admin/reviews/${reviewId}`, { method: 'DELETE' }),
};
