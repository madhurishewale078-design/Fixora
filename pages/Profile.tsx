import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { User, Lock, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || 'Pune',
    bio: '',
    service_area: user?.service_area || ''
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_new_password: ''
  });

  const [profileMsg, setProfileMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setProfileMsg('');
    setErrorMsg('');

    try {
      await api.updateProfile(formData);
      await refreshUser();
      setProfileMsg('Profile updated successfully.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_new_password) {
      setErrorMsg('New passwords do not match');
      return;
    }

    setLoading(true);
    setPasswordMsg('');
    setErrorMsg('');

    try {
      await api.changePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      setPasswordMsg('Password changed successfully.');
      setPasswordData({ current_password: '', new_password: '', confirm_new_password: '' });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Account Profile Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">Manage your identity, location preferences, and security.</p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-600 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Profile Info Form */}
        <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-500" /> Personal Information
          </h2>

          {profileMsg && (
            <div className="p-2.5 bg-emerald-50 text-emerald-700 text-xs rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> {profileMsg}
            </div>
          )}

          <form onSubmit={handleProfileUpdate} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Registered Email</label>
              <input
                type="text"
                disabled
                value={user?.email || ''}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 text-slate-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Full Name</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Address / Location</label>
              <input
                type="text"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md flex items-center gap-1.5 transition"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-500" /> Security & Password
          </h2>

          {passwordMsg && (
            <div className="p-2.5 bg-emerald-50 text-emerald-700 text-xs rounded-lg flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> {passwordMsg}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Current Password</label>
              <input
                type="password"
                required
                value={passwordData.current_password}
                onChange={e => setPasswordData({ ...passwordData, current_password: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">New Password</label>
              <input
                type="password"
                required
                value={passwordData.new_password}
                onChange={e => setPasswordData({ ...passwordData, new_password: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordData.confirm_new_password}
                onChange={e => setPasswordData({ ...passwordData, confirm_new_password: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold shadow-md transition"
            >
              Update Password
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
