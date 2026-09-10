import React, { useEffect, useState } from 'react';
import { Bell, CheckCheck, X, ExternalLink, AlertCircle, Wrench, Star, ShieldCheck } from 'lucide-react';
import { api } from '../api/client';
import { NotificationItem } from '../types';
import { Link } from 'react-router-dom';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateCount?: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, onUpdateCount }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      onUpdateCount?.();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      onUpdateCount?.();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'BOOKING': return <Wrench className="w-4 h-4 text-blue-500" />;
      case 'APPROVAL': return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      case 'REVIEW': return <Star className="w-4 h-4 text-amber-500" />;
      case 'COMPLAINT': return <AlertCircle className="w-4 h-4 text-rose-500" />;
      default: return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 md:p-6 bg-slate-900/30 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden mt-12 transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Notifications</h3>
            <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">
              {notifications.filter(n => !n.is_read).length} new
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 px-2 py-1 rounded"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">No notifications yet.</p>
            </div>
          ) : (
            notifications.map(item => (
              <div
                key={item.id}
                className={`p-4 transition-colors flex items-start gap-3 ${
                  item.is_read ? 'bg-white dark:bg-slate-900 opacity-80' : 'bg-emerald-50/40 dark:bg-emerald-950/20'
                }`}
              >
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 shrink-0">
                  {getIcon(item.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.message}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-1">
                    {item.link_url ? (
                      <Link
                        to={item.link_url}
                        onClick={onClose}
                        className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                      >
                        View details <ExternalLink className="w-3 h-3" />
                      </Link>
                    ) : <span />}
                    {!item.is_read && (
                      <button
                        onClick={() => handleMarkAsRead(item.id)}
                        className="text-[11px] text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
