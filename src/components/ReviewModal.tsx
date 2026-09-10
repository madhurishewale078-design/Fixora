import React, { useState } from 'react';
import { X, Star, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../api/client';
import { Booking } from '../types';
import { StarRating } from './StarRating';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  onSuccess: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  booking,
  onSuccess
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.createReview({
        booking_id: booking.id,
        rating,
        comment
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
              Quality Feedback
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Rate Your Experience
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Technician: {booking.technician_name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="text-center py-2">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Select Star Rating
            </label>
            <div className="flex justify-center">
              <StarRating rating={rating} maxRating={5} interactive size="lg" onRatingChange={setRating} />
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-2">
              {rating === 5 && 'Outstanding & Professional!'}
              {rating === 4 && 'Very Good Service!'}
              {rating === 3 && 'Average Experience'}
              {rating === 2 && 'Needs Improvement'}
              {rating === 1 && 'Unsatisfactory'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Review Comment (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Was the technician punctual? Did the AI diagnosis match the actual issue? Write your feedback here..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 resize-none"
            />
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
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl shadow-lg shadow-amber-500/20 text-sm disabled:opacity-50 flex items-center gap-2 transition"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
