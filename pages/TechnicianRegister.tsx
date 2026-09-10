import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HardHat, Wrench, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../api/client';
import { ServiceCategory } from '../types';

export const TechnicianRegister: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    category_id: 1,
    experience_years: 3,
    service_area: 'Kothrud & Shivajinagar Pune',
    address: 'Pune, Maharashtra',
    bio: '',
    hourly_rate: 350.0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    api.getCategories().then(cats => {
      setCategories(cats);
      if (cats.length > 0) setFormData(prev => ({ ...prev, category_id: cats[0].id }));
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.registerTechnician(formData);
      setSuccessMessage(res.message);
    } catch (err: any) {
      setError(err.message || 'Failed to submit technician application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-2 text-center">
        <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold mx-auto shadow-md">
          <HardHat className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Join Fixora as a Verified Expert
        </h2>
        <p className="text-xs text-slate-500">
          Receive pre-diagnosed customer booking requests in your preferred service area.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
          
          {/* Important Notice */}
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <Shield className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>Verification Policy:</strong> Newly registered technician accounts are placed in <strong>PENDING</strong> status. Administration reviews your profile before activating bookings.
            </span>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-emerald-900 dark:text-emerald-100 text-sm">Application Submitted!</h3>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                {successMessage}
              </p>
              <button
                onClick={() => navigate('/login')}
                className="mt-2 px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-md"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={formData.full_name}
                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="rajesh@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 99000 11223"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Trade / Skill
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={e => setFormData({ ...formData, category_id: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={formData.experience_years}
                    onChange={e => setFormData({ ...formData, experience_years: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Base Visit Rate (₹)
                  </label>
                  <input
                    type="number"
                    step="50"
                    min="150"
                    value={formData.hourly_rate}
                    onChange={e => setFormData({ ...formData, hourly_rate: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Service Area / Coverage
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kothrud, Karve Nagar & Deccan, Pune"
                  value={formData.service_area}
                  onChange={e => setFormData({ ...formData, service_area: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Professional Bio & Certifications
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe your qualifications, toolkits, and past service track record..."
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center justify-center gap-2 transition"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Submit Application for Verification
              </button>
            </form>
          )}

          <div className="pt-2 text-center text-xs text-slate-500">
            Already registered as a technician?{' '}
            <Link to="/login" className="font-bold text-emerald-600 hover:underline">
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
