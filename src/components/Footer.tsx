import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ShieldCheck, Heart, Sparkles, MapPin, Mail, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/80 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Story */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-black flex items-center justify-center border border-slate-700">
                <img src="/logo.png" alt="Fixora Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                FIX<span className="text-emerald-500">ORA</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Fixora transforms home maintenance with our core philosophy: <strong className="text-slate-900 dark:text-slate-200">“Diagnose First. Book Only When Needed.”</strong> Safe interactive AI troubleshooting followed by certified local professionals.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" /> 100% Background Verified Technicians
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/ai-assistant" className="hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-500" /> AI Diagnostic Assistant
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-emerald-600 dark:hover:text-emerald-400">
                  Services Directory
                </Link>
              </li>
              <li>
                <Link to="/technicians" className="hover:text-emerald-600 dark:hover:text-emerald-400">
                  Verified Technicians
                </Link>
              </li>
              <li>
                <Link to="/register/technician" className="hover:text-emerald-600 dark:hover:text-emerald-400 text-emerald-600 dark:text-emerald-400 font-medium">
                  Become a Fixora Partner
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4">
              Service Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>Electrician & Wiring Fix</li>
              <li>Plumbing & Leak Isolation</li>
              <li>AC Cooling & Deep Jet Wash</li>
              <li>RO Purifier & Filter Balancing</li>
              <li>Carpenter & Door Fitting</li>
              <li>Major Appliance Diagnostics</li>
            </ul>
          </div>

          {/* Contact & Administration */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4">
              Project Administration
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                Pune, Maharashtra, India
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                madhurishewale078@gmail.com
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400">Project Lead:</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Madhuri Shewale</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FIXORA. All rights reserved. “Diagnose First. Book Only When Needed.”</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Academic Excellence
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
