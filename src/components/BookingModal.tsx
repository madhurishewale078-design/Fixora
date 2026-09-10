import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { api } from '../api/client';
import { Technician, Service, Booking } from '../types';
import { MapLocationPicker } from './MapLocationPicker';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  technician: Technician;
  initialService?: Service | null;
  diagnosisSummary?: string;
  onSuccess: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  technician,
  initialService,
  diagnosisSummary,
  onSuccess,
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<number>(
    initialService?.id || (technician.services[0]?.id || 1)
  );
  const [preferredDate, setPreferredDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [preferredTime, setPreferredTime] = useState('10:30 AM');
  const [address, setAddress] = useState(technician.service_area || '');
  const [problemDescription, setProblemDescription] = useState(
    diagnosisSummary ? `Fixora AI Diagnosis attached: ${diagnosisSummary}` : ''
  );
  const [latitude, setLatitude] = useState(technician.latitude || 18.5204);
  const [longitude, setLongitude] = useState(technician.longitude || 73.8567);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const currentService = technician.services.find(s => s.id === selectedServiceId) || initialService;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Please provide service address / location.');
      return;
    }
    if (!problemDescription.trim()) {
      setError('Please describe your home issue.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.createBooking({
        technician_id: technician.id,
        service_id: selectedServiceId,
        problem_description: problemDescription,
        diagnosis_summary: diagnosisSummary || null,
        address,
        city: technician.city || 'Pune',
        latitude,
        longitude,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
        estimated_cost: currentService?.price_estimate_min || technician.hourly_rate
      });
      onSuccess(res);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
              Direct Service Booking
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Book with {technician.full_name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {diagnosisSummary && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
              <Shield className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <strong>Fixora AI Diagnosis Attached:</strong>
                <p className="mt-0.5 text-slate-600 dark:text-slate-300">{diagnosisSummary}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Specific Service
            </label>
            <select
              value={selectedServiceId}
              onChange={e => setSelectedServiceId(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
            >
              {technician.services.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} (Est. ₹{s.price_estimate_min} - ₹{s.price_estimate_max})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" /> Preferred Date
              </label>
              <input
                type="date"
                value={preferredDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setPreferredDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-500" /> Preferred Time Slot
              </label>
              <select
                value={preferredTime}
                onChange={e => setPreferredTime(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="09:00 AM - 11:00 AM">Morning (09:00 AM - 11:00 AM)</option>
                <option value="11:00 AM - 01:00 PM">Midday (11:00 AM - 01:00 PM)</option>
                <option value="02:00 PM - 04:00 PM">Afternoon (02:00 PM - 04:00 PM)</option>
                <option value="04:00 PM - 06:00 PM">Evening (04:00 PM - 06:00 PM)</option>
                <option value="06:00 PM - 08:00 PM">Late Evening (06:00 PM - 08:00 PM)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" /> Service Location / Complete Address
            </label>
            <input
              type="text"
              placeholder="e.g. Flat 304, Marvel Arco, Viman Nagar, Pune"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Confirm Pin Location on Map
            </label>
            <MapLocationPicker
              latitude={latitude}
              longitude={longitude}
              onLocationSelect={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
              }}
              className="h-44 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Problem Details & Symptoms
            </label>
            <textarea
              rows={3}
              placeholder="Explain the issue (e.g. Fan makes humming noise, water dripping under kitchen sink...)"
              value={problemDescription}
              onChange={e => setProblemDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 resize-none"
              required
            />
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Estimated Service Cost:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              ₹{currentService?.price_estimate_min || technician.hourly_rate} - ₹{currentService?.price_estimate_max || (technician.hourly_rate * 1.5)}
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-lg shadow-emerald-600/20 text-sm disabled:opacity-50 flex items-center gap-2 transition"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              Confirm Booking Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
