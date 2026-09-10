import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Wrench, Calendar, Clock, MapPin, CheckCircle2, 
  AlertCircle, Star, MessageSquare, XCircle, ArrowRight, Shield 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { Booking } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ReviewModal } from '../components/ReviewModal';
import { ComplaintModal } from '../components/ComplaintModal';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modals state
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [complaintBooking, setComplaintBooking] = useState<Booking | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  useEffect(() => {
    loadBookings();
  }, [statusFilter]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await api.getMyBookings(statusFilter || undefined);
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm('Are you sure you want to cancel this booking request?')) return;
    try {
      await api.updateBookingStatus(bookingId, { status: 'CANCELLED', notes: 'Cancelled by customer' });
      setActionSuccessMessage('Booking cancelled successfully.');
      loadBookings();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel');
    }
  };

  const activeBooking = bookings.find(b => b.status === 'IN_PROGRESS' || b.status === 'ACCEPTED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur-sm">
            <Shield className="w-3.5 h-3.5" /> Customer Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome back, {user?.full_name}!
          </h1>
          <p className="text-xs text-emerald-100 max-w-xl">
            Diagnose home problems first with our AI decision tree before booking to avoid unnecessary fees.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <Link
            to="/ai-assistant"
            className="px-5 py-2.5 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold shadow-md flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Quick AI Diagnose
          </Link>
          <Link
            to="/services"
            className="px-5 py-2.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-900 text-white text-xs font-semibold border border-emerald-500/30 transition"
          >
            Browse Services
          </Link>
        </div>
      </div>

      {actionSuccessMessage && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
          <span>{actionSuccessMessage}</span>
          <button onClick={() => setActionSuccessMessage('')} className="font-bold">Dismiss</button>
        </div>
      )}

      {/* Active Service In Progress Card */}
      {activeBooking && (
        <div className="p-6 rounded-3xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-500 animate-ping" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-purple-900 dark:text-purple-300">
                Active Service in Progress
              </h2>
            </div>
            <StatusBadge status={activeBooking.status} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400">Service:</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">{activeBooking.service_name}</p>
              <p className="text-[11px] text-slate-500">Booking #{activeBooking.booking_number}</p>
            </div>
            <div>
              <span className="text-slate-400">Assigned Technician:</span>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">{activeBooking.technician_name}</p>
              <p className="text-[11px] text-emerald-600 font-medium">Contact: {activeBooking.technician_phone || 'Shared in App'}</p>
            </div>
            <div>
              <span className="text-slate-400">Appointment:</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{activeBooking.preferred_date}</p>
              <p className="text-[11px] text-slate-500">{activeBooking.preferred_time}</p>
            </div>
          </div>
        </div>
      )}

      {/* Bookings Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              My Service Bookings
            </h2>
            <p className="text-xs text-slate-500">Track current status and historical visits.</p>
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['', 'PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  statusFilter === s
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {s || 'All Bookings'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="p-12 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <Wrench className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No bookings found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You do not have any active or past service requests under this filter.
            </p>
            <Link
              to="/ai-assistant"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow"
            >
              <Sparkles className="w-3.5 h-3.5" /> Diagnose an Issue
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {bookings.map(booking => (
              <div
                key={booking.id}
                className="p-6 rounded-2xl glass-card border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-emerald-500/40 transition"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                      {booking.booking_number}
                    </span>
                    <StatusBadge status={booking.status} />
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      • {booking.service_name}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                    <strong>Issue:</strong> {booking.problem_description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Wrench className="w-3.5 h-3.5 text-emerald-500" />
                      Technician: <strong>{booking.technician_name}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                      {booking.preferred_date} ({booking.preferred_time})
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                      {booking.city}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="text-right sm:mr-4">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Amount</span>
                    <div className="text-base font-black text-slate-900 dark:text-slate-100">
                      ₹{booking.final_amount || booking.estimated_cost}
                    </div>
                  </div>

                  {/* Actions based on status */}
                  <div className="flex items-center gap-2">
                    {booking.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 text-xs font-semibold hover:bg-rose-50"
                      >
                        Cancel
                      </button>
                    )}

                    {booking.status === 'COMPLETED' && (
                      <>
                        {!booking.has_review && (
                          <button
                            onClick={() => setReviewBooking(booking)}
                            className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
                          >
                            <Star className="w-3.5 h-3.5" /> Rate & Review
                          </button>
                        )}
                        {!booking.has_complaint && (
                          <button
                            onClick={() => setComplaintBooking(booking)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-rose-600 text-xs font-semibold"
                          >
                            Raise Issue
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewBooking && (
        <ReviewModal
          isOpen={true}
          booking={reviewBooking}
          onClose={() => setReviewBooking(null)}
          onSuccess={() => {
            setActionSuccessMessage('Thank you! Your review was submitted successfully.');
            loadBookings();
          }}
        />
      )}

      {/* Complaint Modal */}
      {complaintBooking && (
        <ComplaintModal
          isOpen={true}
          booking={complaintBooking}
          onClose={() => setComplaintBooking(null)}
          onSuccess={() => {
            setActionSuccessMessage('Your complaint has been submitted. Fixora administration will investigate promptly.');
            loadBookings();
          }}
        />
      )}

    </div>
  );
};
