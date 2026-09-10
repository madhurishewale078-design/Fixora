import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { api } from '../api/client';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.forgotPassword(email);
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4 text-center">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-black flex items-center justify-center border border-slate-700">
            <img src="/logo.png" alt="Fixora Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            FIX<span className="text-emerald-500">ORA</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Reset Password
        </h2>
        <p className="text-xs text-slate-500">
          Enter your registered email address to receive password reset guidance.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-6 shadow-2xl">
          {submitted ? (
            <div className="text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Request Sent</h3>
              <p className="text-xs text-slate-500">
                If an account exists for {email}, reset instructions have been dispatched.
              </p>
              <Link to="/login" className="inline-block text-xs font-bold text-emerald-600 hover:underline pt-2">
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-2 transition"
              >
                Send Reset Link
              </button>
            </form>
          )}

          <div className="pt-2 text-center text-xs text-slate-500">
            Remembered your password?{' '}
            <Link to="/login" className="font-bold text-emerald-600 hover:underline">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
