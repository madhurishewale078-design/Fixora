import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, HardHat, Wrench, AlertCircle, CheckCircle2, 
  XCircle, TrendingUp, DollarSign, Star, Search, Filter, MessageSquare, 
  Trash2, Send, RefreshCw, Eye 
} from 'lucide-react';
import { api } from '../api/client';
import { AdminAnalytics, Technician, Booking, ComplaintItem, ReviewItem } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { StarRating } from '../components/StarRating';

export const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'technicians' | 'customers' | 'bookings' | 'complaints'>('overview');
  
  // Tab Data States
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [complaints, setComplaints] = useState<ComplaintItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [techFilter, setTechFilter] = useState('');
  
  // Action states
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);
  const [adminResponseText, setAdminResponseText] = useState('');
  const [statusActionMsg, setStatusActionMsg] = useState('');

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [analyticsData, techList, custList, bookList, compList] = await Promise.all([
        api.getAdminAnalytics(),
        api.getAdminTechnicians(),
        api.getAdminCustomers(),
        api.getMyBookings(), // Admin gets all bookings
        api.getMyComplaints() // Admin gets all complaints
      ]);
      setAnalytics(analyticsData);
      setTechnicians(techList);
      setCustomers(custList);
      setBookings(bookList);
      setComplaints(compList);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTechStatusUpdate = async (techId: number, status: string, reason?: string) => {
    try {
      await api.updateTechnicianStatus(techId, { status, rejection_reason: reason });
      setStatusActionMsg(`Technician status successfully updated to ${status}.`);
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    }
  };

  const handleToggleCustomerActive = async (userId: number) => {
    try {
      await api.toggleUserActive(userId);
      setStatusActionMsg('Customer account status updated.');
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Error toggling user');
    }
  };

  const handleResolveComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    try {
      await api.resolveComplaint(selectedComplaint.id, {
        status: 'RESOLVED',
        admin_response: adminResponseText
      });
      setStatusActionMsg(`Complaint #${selectedComplaint.complaint_number} marked as RESOLVED.`);
      setSelectedComplaint(null);
      setAdminResponseText('');
      loadAllAdminData();
    } catch (err: any) {
      alert(err.message || 'Error resolving complaint');
    }
  };

  const filteredTechs = techFilter
    ? technicians.filter(t => t.status === techFilter)
    : technicians;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Title Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
            <Shield className="w-3.5 h-3.5 text-indigo-400" /> Executive Administration Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Fixora Operations Management
          </h1>
          <p className="text-xs text-slate-400">
            Platform Owner: <strong className="text-white font-semibold">Madhuri Shewale</strong> (<span className="text-indigo-300">madhurishewale078@gmail.com</span>)
          </p>
        </div>

        <button
          onClick={loadAllAdminData}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Analytics
        </button>
      </div>

      {statusActionMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-between animate-fade-in">
          <span>{statusActionMsg}</span>
          <button onClick={() => setStatusActionMsg('')} className="font-bold">Dismiss</button>
        </div>
      )}

      {/* Analytics KPI Cards */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Customers</span>
              <Users className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">
              {analytics.total_customers}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">Registered Accounts</span>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Technicians</span>
              <HardHat className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2 flex items-center gap-2">
              <span>{analytics.total_technicians}</span>
              {analytics.pending_technicians > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold animate-pulse">
                  {analytics.pending_technicians} PENDING
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-400">{analytics.approved_technicians} Active & Approved</span>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Total Bookings</span>
              <Wrench className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">
              {analytics.total_bookings}
            </div>
            <span className="text-[10px] text-slate-400">{analytics.completed_bookings} Completed Jobs</span>
          </div>

          <div className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Platform Revenue</span>
              <DollarSign className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
              ₹{analytics.total_revenue_estimate.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400">{analytics.open_complaints} Open Inquiries</span>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Platform Analytics' },
          { id: 'technicians', label: `Technician Approvals (${analytics?.pending_technicians || 0} Pending)` },
          { id: 'customers', label: 'Customer Management' },
          { id: 'bookings', label: 'Booking Oversight' },
          { id: 'complaints', label: `Complaints (${analytics?.open_complaints || 0})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview & Charts */}
      {activeTab === 'overview' && analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Service Category Distribution
            </h3>
            <div className="space-y-3">
              {analytics.category_distribution.map(cat => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>{cat.name}</span>
                    <span>{cat.count} bookings</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${Math.min(100, (cat.count / (analytics.total_bookings || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Monthly Platform Growth Trend
            </h3>
            <div className="space-y-3">
              {analytics.monthly_trend.map(m => (
                <div key={m.month} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{m.month}</span>
                  <div className="flex items-center gap-6">
                    <span className="text-slate-500">{m.bookings} Bookings</span>
                    <span className="font-bold text-emerald-600">₹{m.revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Technician Approvals & Management */}
      {activeTab === 'technicians' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Technician Applications & Approvals
              </h2>
              <p className="text-xs text-slate-500">
                Review technician qualifications, verify background, and grant platform access.
              </p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              {['', 'PENDING', 'APPROVED', 'SUSPENDED'].map(f => (
                <button
                  key={f}
                  onClick={() => setTechFilter(f)}
                  className={`px-3 py-1 rounded-lg transition ${
                    techFilter === f ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {f || 'All'}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 dark:bg-slate-800/70 text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Technician</th>
                  <th className="p-4">Skill / Category</th>
                  <th className="p-4">Experience</th>
                  <th className="p-4">Service Area</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTechs.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">
                      <div>{t.full_name}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{t.email} • {t.phone}</div>
                    </td>
                    <td className="p-4 font-medium text-emerald-600 dark:text-emerald-400">{t.category_name}</td>
                    <td className="p-4">{t.experience_years} years</td>
                    <td className="p-4 text-slate-500">{t.service_area}</td>
                    <td className="p-4">
                      <StatusBadge status={t.status} size="sm" />
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {t.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleTechStatusUpdate(t.id, 'APPROVED')}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleTechStatusUpdate(t.id, 'REJECTED', 'Documents incomplete')}
                            className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg font-semibold hover:bg-rose-100 transition"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {t.status === 'APPROVED' && (
                        <button
                          onClick={() => handleTechStatusUpdate(t.id, 'SUSPENDED')}
                          className="px-3 py-1 border border-slate-300 dark:border-slate-700 text-slate-600 rounded-lg hover:bg-slate-100"
                        >
                          Suspend
                        </button>
                      )}

                      {t.status === 'SUSPENDED' && (
                        <button
                          onClick={() => handleTechStatusUpdate(t.id, 'APPROVED')}
                          className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold"
                        >
                          Reactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Customer Management */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 dark:bg-slate-800/70 text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Address / City</th>
                  <th className="p-4">Total Bookings</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {customers.map(c => (
                  <tr key={c.id}>
                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">{c.full_name}</td>
                    <td className="p-4 text-slate-500">{c.email}</td>
                    <td className="p-4">{c.phone}</td>
                    <td className="p-4 text-slate-500">{c.address}, {c.city}</td>
                    <td className="p-4 font-bold">{c.total_bookings} visits</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {c.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleCustomerActive(c.user_id)}
                        className="text-xs font-semibold text-slate-600 hover:underline"
                      >
                        {c.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Booking Oversight */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 dark:bg-slate-800/70 text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Booking #</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Technician</th>
                  <th className="p-4">Preferred Slot</th>
                  <th className="p-4">Cost</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td className="p-4 font-mono font-bold text-slate-600">{b.booking_number}</td>
                    <td className="p-4 font-semibold text-slate-900 dark:text-slate-100">{b.service_name}</td>
                    <td className="p-4">{b.customer_name}</td>
                    <td className="p-4 font-medium text-emerald-600">{b.technician_name}</td>
                    <td className="p-4 text-slate-500">{b.preferred_date} ({b.preferred_time})</td>
                    <td className="p-4 font-bold">₹{b.final_amount || b.estimated_cost}</td>
                    <td className="p-4"><StatusBadge status={b.status} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Complaints Resolution */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-2xl glass-card border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 dark:bg-slate-800/70 text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Ticket #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Technician</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Resolve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {complaints.map(c => (
                  <tr key={c.id}>
                    <td className="p-4 font-mono font-bold text-rose-600">{c.complaint_number}</td>
                    <td className="p-4 font-semibold">{c.customer_name}</td>
                    <td className="p-4">{c.technician_name}</td>
                    <td className="p-4 max-w-xs truncate">{c.subject}</td>
                    <td className="p-4"><StatusBadge status={c.status} size="sm" /></td>
                    <td className="p-4 text-right">
                      {c.status !== 'RESOLVED' && c.status !== 'CLOSED' ? (
                        <button
                          onClick={() => {
                            setSelectedComplaint(c);
                            setAdminResponseText('');
                          }}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold"
                        >
                          Resolve Ticket
                        </button>
                      ) : (
                        <span className="text-slate-400 font-medium">Closed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Resolve Modal */}
          {selectedComplaint && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Resolve Complaint #{selectedComplaint.complaint_number}
                </h3>
                <div className="text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl space-y-1">
                  <div><strong>Customer:</strong> {selectedComplaint.customer_name}</div>
                  <div><strong>Technician:</strong> {selectedComplaint.technician_name}</div>
                  <div><strong>Description:</strong> {selectedComplaint.description}</div>
                </div>

                <form onSubmit={handleResolveComplaint} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Official Admin Resolution Response
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="e.g. Technician re-inspected issue and rectified joint leak..."
                      value={adminResponseText}
                      onChange={e => setAdminResponseText(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs bg-white dark:bg-slate-900"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedComplaint(null)}
                      className="px-4 py-2 text-xs text-slate-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md"
                    >
                      Save & Notify Customer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
