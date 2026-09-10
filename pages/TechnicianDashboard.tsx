import React, { useState, useEffect } from 'react';
import { 
  HardHat, ShieldCheck, CheckCircle2, XCircle, Clock, MapPin, 
  Calendar, Star, DollarSign, Wrench, AlertCircle, PlayCircle, CheckSquare 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { Booking } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { StarRating } from '../components/StarRating';

export const TechnicianDashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');
  const [completingBookingId, setCompletingBookingId] = useState<number | null>(null);
  const [finalAmount, setFinalAmount] = useState<number>(450);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const data = await api.getMyBookings();
      setBookings(data);
      if (user?.technician_id) {
        const revs = await api.getTechnicianReviews(user.technician_id);
        setReviews(revs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: number, newStatus: string, finalBill?: number) => {
    try {
      await api.updateBookingStatus(bookingId, {
        status: newStatus,
        final_amount: finalBill
      });
      setActionMessage(`Booking transitioned to ${newStatus} successfully.`);
      setCompletingBookingId(null);
      loadDashboard();
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    }
  };

  // Group bookings
  const pendingRequests = bookings.filter(b => b.status === 'PENDING');
  const activeJobs = bookings.filter(b => b.status === 'ACCEPTED' || b.status === 'IN_PROGRESS');
  const completedJobs = bookings.filter(b => b.status === 'COMPLETED');
  const totalEarnings = completedJobs.reduce((acc, curr) => acc + (curr.final_amount || curr.estimated_cost), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Profile Bar */}
      <div className="p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xl">
            <HardHat className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                {user?.full_name}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Partner
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Service Area: <strong className="text-slate-800 dark:text-slate-200">{user?.service_area || 'Pune Region'}</strong> • Trade: {user?.category_name || 'Home Maintenance'}
            </p>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-6 self-stretch md:self-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-800">
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Jobs</span>
            <div className="text-xl font-black text-slate-900 dark:text-slate-100">{completedJobs.length}</div>
          </div>
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Rating</span>
            <div className="text-xl font-black text-amber-500 flex items-center gap-1 justify-center">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              {user?.rating || 5.0}
            </div>
          </div>
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Earnings</span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              ₹{totalEarnings.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage('')} className="font-bold">Dismiss</button>
        </div>
      )}

      {/* Incoming Requests Section (PENDING) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Incoming Booking Requests ({pendingRequests.length})
            </h2>
            <p className="text-xs text-slate-500">Customer requests awaiting your immediate review & acceptance.</p>
          </div>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="p-8 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
            No pending booking requests right now. New requests will notify you in real-time.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingRequests.map(req => (
              <div key={req.id} className="p-6 rounded-2xl glass-card border-2 border-amber-400/40 space-y-4 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-600">{req.booking_number}</span>
                  <StatusBadge status="PENDING" />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{req.service_name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Customer Issue:</strong> {req.problem_description}
                  </p>
                  {req.diagnosis_summary && (
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-lg mt-2">
                      💡 {req.diagnosis_summary}
                    </p>
                  )}
                </div>

                <div className="text-xs text-slate-500 space-y-1">
                  <div>Customer: <strong>{req.customer_name}</strong> ({req.customer_phone || 'Protected'})</div>
                  <div>Address: {req.address}, {req.city}</div>
                  <div>Preferred Slot: {req.preferred_date} at {req.preferred_time}</div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 pt-1">
                    Estimated Fee: ₹{req.estimated_cost}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleStatusChange(req.id, 'ACCEPTED')}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Accept Job
                  </button>
                  <button
                    onClick={() => handleStatusChange(req.id, 'REJECTED')}
                    className="px-4 py-2 border border-rose-200 dark:border-rose-900 text-rose-600 rounded-xl text-xs font-semibold hover:bg-rose-50 transition"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Jobs in Progress */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-purple-500" />
            Active & Scheduled Jobs ({activeJobs.length})
          </h2>
          <p className="text-xs text-slate-500">Manage service progress and mark completed upon visit completion.</p>
        </div>

        {activeJobs.length === 0 ? (
          <div className="p-8 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
            No active jobs at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {activeJobs.map(job => (
              <div key={job.id} className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">{job.booking_number}</span>
                    <StatusBadge status={job.status} />
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">• {job.service_name}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <strong>Customer:</strong> {job.customer_name} ({job.customer_phone || 'No phone'}) | <strong>Address:</strong> {job.address}
                  </p>
                  <p className="text-xs text-slate-500">
                    Schedule: {job.preferred_date} ({job.preferred_time})
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {job.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleStatusChange(job.id, 'IN_PROGRESS')}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition"
                    >
                      <PlayCircle className="w-4 h-4" /> Start Service (In Progress)
                    </button>
                  )}

                  {job.status === 'IN_PROGRESS' && (
                    <>
                      {completingBookingId === job.id ? (
                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-xl">
                          <label className="text-xs text-slate-500">Final Bill (₹):</label>
                          <input
                            type="number"
                            value={finalAmount}
                            onChange={e => setFinalAmount(Number(e.target.value))}
                            className="w-24 px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                          />
                          <button
                            onClick={() => handleStatusChange(job.id, 'COMPLETED', finalAmount)}
                            className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-bold"
                          >
                            Confirm Finish
                          </button>
                          <button
                            onClick={() => setCompletingBookingId(null)}
                            className="text-xs text-slate-400"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setCompletingBookingId(job.id);
                            setFinalAmount(job.estimated_cost);
                          }}
                          className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition"
                        >
                          <CheckSquare className="w-4 h-4" /> Mark Service Completed
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Jobs History */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Completed Services History ({completedJobs.length})
          </h2>
          <p className="text-xs text-slate-500">Archived list of your successfully resolved household maintenance jobs.</p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 overflow-hidden">
          {completedJobs.slice(0, 5).map(job => (
            <div key={job.id} className="p-4 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100">{job.service_name}</span>
                <span className="text-slate-400 ml-2">#{job.booking_number} for {job.customer_name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-500">{job.preferred_date}</span>
                <span className="font-bold text-emerald-600">₹{job.final_amount || job.estimated_cost}</span>
                <StatusBadge status="COMPLETED" size="sm" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Reviews Feed */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Customer Feedback & Ratings
          </h2>
          <p className="text-xs text-slate-500">Real feedback submitted by customers after job completion.</p>
        </div>

        {reviews.length === 0 ? (
          <div className="p-6 rounded-2xl glass-card text-center text-xs text-slate-400">
            No reviews yet. Complete bookings to earn ratings!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map(r => (
              <div key={r.id} className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{r.customer_name}</span>
                  <StarRating rating={r.rating} size="sm" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 italic">"{r.comment}"</p>
                <span className="text-[10px] text-slate-400 block">{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
