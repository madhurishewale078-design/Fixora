import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, Wrench, Bell, User, LogOut, Menu, X, Shield, 
  ChevronDown, LayoutDashboard, Calendar, HelpCircle, HardHat, Presentation
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { NotificationModal } from './NotificationModal';
import { api } from '../api/client';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadUnreadCount();
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadUnreadCount = async () => {
    try {
      const res = await api.getUnreadCount();
      setUnreadCount(res.unread_count || 0);
    } catch {
      // ignore
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform flex items-center justify-center bg-black border border-slate-700">
              <img src="/logo.png" alt="Fixora Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  FIX<span className="text-emerald-500">ORA</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                  AI-Assisted
                </span>
              </div>
              <span className="hidden sm:block text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-1 tracking-tight">
                Diagnose First. Book Only When Needed.
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/ai-assistant"
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isActive('/ai-assistant')
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
              }`}
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              AI Diagnosis
            </Link>
            <Link
              to="/services"
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition ${
                isActive('/services')
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Services
            </Link>
            <Link
              to="/technicians"
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition ${
                isActive('/technicians')
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Verified Experts
            </Link>

            <a
              href="/presentation.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 shadow-sm"
              title="Open FIXORA Interactive PPT Presentation in Browser"
            >
              <Presentation className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>PPT Deck</span>
            </a>

            {/* Role-Specific Quick Links */}
            {role === 'CUSTOMER' && (
              <Link
                to="/customer/dashboard"
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition flex items-center gap-1 ${
                  isActive('/customer/dashboard')
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Customer Panel
              </Link>
            )}

            {role === 'TECHNICIAN' && (
              <Link
                to="/technician/dashboard"
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition flex items-center gap-1 ${
                  isActive('/technician/dashboard')
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <HardHat className="w-3.5 h-3.5" />
                Technician Hub
              </Link>
            )}

            {role === 'ADMIN' && (
              <Link
                to="/admin/dashboard"
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition flex items-center gap-1 ${
                  isActive('/admin/dashboard')
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-indigo-500" />
                Admin Console
              </Link>
            )}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <button
                  onClick={() => setIsNotifOpen(true)}
                  className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200/60 dark:border-slate-800/80"
                  aria-label="View notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                      {user?.full_name?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden lg:block">
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
                        {user?.full_name}
                      </div>
                      <div className="text-[10px] text-slate-400 -mt-0.5 uppercase tracking-wider font-mono">
                        {role}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {isUserMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-fade-in"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{user?.full_name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                      </div>

                      {role === 'CUSTOMER' && (
                        <Link
                          to="/customer/dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-emerald-500" />
                          Customer Dashboard
                        </Link>
                      )}

                      {role === 'TECHNICIAN' && (
                        <Link
                          to="/technician/dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <HardHat className="w-3.5 h-3.5 text-emerald-500" />
                          Technician Dashboard
                        </Link>
                      )}

                      {role === 'ADMIN' && (
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <Shield className="w-3.5 h-3.5 text-indigo-500" />
                          Admin Console
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        <User className="w-3.5 h-3.5" />
                        My Profile
                      </Link>

                      <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md shadow-emerald-600/20 transition hidden sm:inline-flex items-center gap-1.5"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2">
            <Link
              to="/ai-assistant"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-sm font-semibold"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              AI Diagnostic Assistant
            </Link>
            <Link
              to="/services"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 text-sm text-slate-700 dark:text-slate-300"
            >
              Home Services Catalog
            </Link>
            <Link
              to="/technicians"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block p-2 text-sm text-slate-700 dark:text-slate-300"
            >
              Verified Technicians
            </Link>
            <a
              href="/presentation.html"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2 text-sm font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 rounded-xl"
            >
              <Presentation className="w-4 h-4" />
              <span>Project Presentation (PPT)</span>
            </a>

            {isAuthenticated ? (
              <>
                <div className="border-t border-slate-100 dark:border-slate-800 my-2 pt-2">
                  <p className="text-[11px] text-slate-400 font-mono px-2 uppercase">{role} PORTAL</p>
                  {role === 'CUSTOMER' && (
                    <Link
                      to="/customer/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block p-2 text-sm text-emerald-600 font-medium"
                    >
                      Customer Dashboard
                    </Link>
                  )}
                  {role === 'TECHNICIAN' && (
                    <Link
                      to="/technician/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block p-2 text-sm text-emerald-600 font-medium"
                    >
                      Technician Dashboard
                    </Link>
                  )}
                  {role === 'ADMIN' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block p-2 text-sm text-indigo-600 font-medium"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block p-2 text-sm text-slate-700 dark:text-slate-300"
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left p-2 text-sm text-rose-600"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-3 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold"
                >
                  Customer Register
                </Link>
                <Link
                  to="/register/technician"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-xs text-slate-500 hover:text-emerald-600"
                >
                  Join as Technician
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Notification Drawer */}
      <NotificationModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        onUpdateCount={loadUnreadCount}
      />
    </>
  );
};
