import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { AppNotification } from '../../types/index.ts';
import { ArrowLeft, Bell, Sparkles, ShieldAlert, AlertCircle, Megaphone, Inbox } from 'lucide-react';

interface NotificationsPageProps {
  onBack: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onBack }) => {
  const { notifications, user } = useAuth();

  const getIconForType = (type?: string) => {
    switch (type) {
      case 'alert':
        return {
          icon: ShieldAlert,
          color: 'text-red-400 bg-red-500/10 border-red-500/20',
        };
      case 'success':
        return {
          icon: Sparkles,
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        };
      case 'admin':
        return {
          icon: Megaphone,
          color: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
        };
      default:
        return {
          icon: Bell,
          color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        };
    }
  };

  return (
    <div className="min-h-screen pb-12 space-y-4">
      {/* Top Header */}
      <div className="flex items-center gap-3 pt-2 pb-3 border-b border-stone-800">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-[#16171d] border border-stone-800 flex items-center justify-center text-stone-300 hover:text-white hover:border-amber-500/50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-1.5">
            Notifications <Bell className="w-4 h-4 text-amber-400" />
          </h1>
          <p className="text-xs text-stone-400">Official updates &amp; alerts</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {notifications.length === 0 ? (
          <div className="p-8 text-center bg-[#15161c] rounded-3xl border border-stone-800 text-stone-500 text-xs flex flex-col items-center gap-2">
            <Inbox className="w-8 h-8 text-stone-600" />
            <span>No notifications at this time.</span>
          </div>
        ) : (
          notifications.map((n: AppNotification) => {
            const { icon: Icon, color } = getIconForType(n.type);
            return (
              <div
                key={n.id}
                className="p-4 rounded-3xl bg-[#15161c] border border-stone-800 hover:border-stone-700 transition-all flex gap-3.5"
              >
                <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{n.title}</h4>
                    <span className="text-[10px] text-stone-500">{n.time}</span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1 leading-relaxed">{n.desc}</p>
                  {n.date && (
                    <span className="text-[10px] text-stone-500 mt-1.5 block">
                      {n.date}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
