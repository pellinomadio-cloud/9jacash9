import React from 'react';
import { X, Bell, Sparkles, ShieldAlert, CheckCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  if (!isOpen) return null;

  const notifications = [
    {
      id: '1',
      title: 'Welcome to 9jacash! 🎉',
      desc: `Welcome ${user?.name || ''}! Your secure digital account has been created. Enjoy zero fees and instant banking.`,
      time: 'Just now',
      icon: Sparkles,
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      unread: true,
    },
    {
      id: '2',
      title: '5% Cashback Active',
      desc: 'Top up any MTN, Airtel, Glo or 9mobile line and receive 5% cash reward back.',
      time: 'Today',
      icon: Sparkles,
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      unread: true,
    },
    {
      id: '3',
      title: 'Security Alert: PIN Protection',
      desc: 'Never share your 4-digit secret PIN with anyone. 9jacash staff will never request it.',
      time: '1 hour ago',
      icon: ShieldAlert,
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      unread: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#14151b] border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-2xl text-stone-200">
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Notifications</h3>
              <p className="text-[11px] text-stone-400">Stay updated on account alerts</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-3 space-y-2.5 max-h-[60vh] overflow-y-auto">
          {notifications.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.id}
                className="p-3 rounded-2xl bg-[#1a1c24] border border-stone-800/80 hover:border-stone-700 transition-all flex gap-3"
              >
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${n.iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{n.title}</h4>
                    <span className="text-[10px] text-stone-500">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">{n.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-stone-800 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#1c1e26] hover:bg-[#252834] text-xs font-semibold text-stone-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
