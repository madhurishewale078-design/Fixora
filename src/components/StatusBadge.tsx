import React from 'react';
import { BookingStatus, TechnicianStatus, ComplaintStatus } from '../types';

interface StatusBadgeProps {
  status: BookingStatus | TechnicianStatus | ComplaintStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toUpperCase();

  let colorClasses = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';

  switch (normalized) {
    case 'PENDING':
    case 'OPEN':
      colorClasses = 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800/50';
      break;
    case 'ACCEPTED':
    case 'IN_REVIEW':
      colorClasses = 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800/50';
      break;
    case 'IN_PROGRESS':
      colorClasses = 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800/50 animate-pulse';
      break;
    case 'COMPLETED':
    case 'APPROVED':
    case 'RESOLVED':
      colorClasses = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50';
      break;
    case 'REJECTED':
    case 'CANCELLED':
    case 'SUSPENDED':
    case 'CLOSED':
      colorClasses = 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800/50';
      break;
  }

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${sizeClass} ${colorClasses}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {normalized.replace('_', ' ')}
    </span>
  );
};
