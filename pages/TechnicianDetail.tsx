import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Star, MapPin, Award, CheckCircle2, ArrowLeft, Calendar } from 'lucide-react';
import { api } from '../api/client';
import { Technician } from '../types';
import { StarRating } from '../components/StarRating';
import { BookingModal } from '../components/BookingModal';
import { MapLocationPicker } from '../components/MapLocationPicker';
import { useAuth } from '../context/AuthContext';

export const TechnicianDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [tech, setTech] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadDetail(Number(id));
    }
  }, [id]);

  const loadDetail = async (techId: number) => {
    try {
      const data = await api.getTechnicianDetail(techId);
      setTech(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-slate-400">Loading technician profile...</div>;
  }

  if (!tech) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500">Technician not found or not approved.</p>
        <button onClick={() => navigate('/technicians')} className="mt-4 text-emerald-600 font-semibold underline">
          Back to directory
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to technicians
      </button>

      {/* Main Profile Header */}
      <div className="p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-6">
          <img
            src={tech.avatar_url || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150'}
            alt={tech.full_name}
            className="w-24 h-24 rounded-3xl object-cover border-4 border-emerald-500/20 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                {tech.full_name}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Partner
              </span>
            </div>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
              {tech.category_name} Specialist • {tech.experience_years} Years Experience
            </p>
            <div className="flex items-center gap-2 mt-2">
              <StarRating rating={Math.round(tech.rating)} />
              <strong className="text-sm text-slate-800 dark:text-slate-200">{tech.rating}</strong>
              <span className="text-xs text-slate-400">({tech.total_reviews} verified customer reviews)</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            if (!isAuthenticated) navigate('/login');
            else setIsBookingOpen(true);
          }}
          className="w-full md:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
        >
          <Calendar className="w-4 h-4" /> Book Technician
        </button>
      </div>

      {/* Profile Details & Bio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="md:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Professional Biography
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {tech.bio || 'Certified Fixora service partner. Proven track record in rapid troubleshooting, safe repair protocols, and customer satisfaction.'}
            </p>
          </div>

          {/* Services Offered */}
          <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Services & Skills Offered
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tech.services?.map((svc: any) => (
                <div key={svc.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs">
                  <div className="font-bold text-slate-800 dark:text-slate-200">{svc.name}</div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                    Est. ₹{svc.price_estimate_min} - ₹{svc.price_estimate_max}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Customer Reviews ({tech.reviews?.length || 0})
            </h3>
            {tech.reviews?.length === 0 ? (
              <p className="text-xs text-slate-400">No reviews yet.</p>
            ) : (
              <div className="space-y-3">
                {tech.reviews.map((r: any) => (
                  <div key={r.id} className="p-4 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{r.customer_name}</span>
                      <StarRating rating={r.rating} size="sm" />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info & Map */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
              Operational Details
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400">Service Coverage Area:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{tech.service_area}</p>
              </div>
              <div>
                <span className="text-slate-400">Base Hourly / Diagnostic Rate:</span>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">₹{tech.hourly_rate} / visit</p>
              </div>
              <div>
                <span className="text-slate-400">Verified Platform Jobs:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{tech.total_jobs} completed</p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Service Location
            </h3>
            <MapLocationPicker
              latitude={tech.latitude || 18.5204}
              longitude={tech.longitude || 73.8567}
              serviceRadiusMeters={3500}
              readOnly={true}
              className="h-44 rounded-xl overflow-hidden"
            />
          </div>
        </div>

      </div>

      {/* Booking Modal */}
      {isBookingOpen && (
        <BookingModal
          isOpen={true}
          onClose={() => setIsBookingOpen(false)}
          technician={tech}
          onSuccess={() => {
            navigate('/customer/dashboard');
          }}
        />
      )}

    </div>
  );
};
