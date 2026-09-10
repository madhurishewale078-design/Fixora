import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Home, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
        <Wrench className="w-8 h-8 rotate-45" />
      </div>
      <h1 className="text-4xl font-black text-slate-900 dark:text-white">404</h1>
      <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300">Page Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm">
        The diagnostic path or service link you requested does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md inline-flex items-center gap-2"
      >
        <Home className="w-4 h-4" /> Return to Homepage
      </Link>
    </div>
  );
};
