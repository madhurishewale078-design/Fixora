import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, AlertCircle, Sparkles, User, HardHat, CheckCircle2 } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.login({ email, password });
      login(res.access_token, res.user);

      // Redirect by role
      if (res.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (res.user.role === 'TECHNICIAN') {
        navigate('/technician/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    setError('');

    try {
      const res = await api.login({ email: demoEmail, password: demoPass });
      login(res.access_token, res.user);

      if (res.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (res.user.role === 'TECHNICIAN') {
        navigate('/technician/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4 text-center">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-black flex items-center justify-center shadow-md shadow-emerald-500/20 border border-slate-700">
            <img src="/logo.png" alt="Fixora Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            FIX<span className="text-emerald-500">ORA</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Sign in to your account
        </h2>
        <p className="text-xs text-slate-500">
          Access your personalized dashboard based on your registered role.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-6 shadow-2xl">
          
          {error && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-600 dark:text-rose-300 space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
              {error.includes('PENDING') && (
                <div className="pt-1 text-[11px] text-slate-600 dark:text-slate-300 border-t border-rose-200/60 dark:border-rose-800/40">
                  💡 <strong>Tip:</strong> New technicians need Admin verification first.{' '}
                  <button
                    onClick={() => quickLogin('madhurishewale078@gmail.com', 'Admin@Fixora2025')}
                    className="underline text-indigo-600 dark:text-indigo-400 font-bold ml-1"
                  >
                    Login as Admin to Approve
                  </button>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs text-emerald-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              Sign In
            </button>
          </form>

          {/* Quick Demo Logins for Presentation & Viva */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 justify-center">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              One-Click Demo Logins
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => quickLogin('madhurishewale078@gmail.com', 'Admin@Fixora2025')}
                className="p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 flex items-center justify-center gap-1.5 transition text-left"
              >
                <Shield className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Admin Login</span>
              </button>

              <button
                type="button"
                onClick={() => quickLogin('rahul.sharma@example.com', 'User@12345')}
                className="p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 flex items-center justify-center gap-1.5 transition text-left"
              >
                <User className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Customer</span>
              </button>

              <button
                type="button"
                onClick={() => quickLogin('rajesh.electrician@example.com', 'Tech@12345')}
                className="p-2.5 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50/60 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/60 flex items-center justify-center gap-1.5 transition text-left"
              >
                <HardHat className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Tech (Rajesh)</span>
              </button>

              <button
                type="button"
                onClick={() => quickLogin('dinesh.pawar@example.com', 'Tech@12345')}
                className="p-2.5 rounded-xl border border-teal-200 dark:border-teal-900 bg-teal-50/60 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 font-semibold hover:bg-teal-100 dark:hover:bg-teal-900/60 flex items-center justify-center gap-1.5 transition text-left"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>Tech (Dinesh)</span>
              </button>
            </div>
          </div>

          <div className="pt-2 text-center text-xs text-slate-500 space-y-1">
            <div>
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-emerald-600 hover:underline">
                Register as Customer
              </Link>
            </div>
            <div>
              Are you a service professional?{' '}
              <Link to="/register/technician" className="font-bold text-slate-700 dark:text-slate-300 hover:underline">
                Apply as Technician
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
