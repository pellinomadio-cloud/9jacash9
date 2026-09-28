import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { User, Bell, Settings, LogOut, Shield, Copy, Check } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, onOpenNotifications }) => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning,';
    if (hour < 17) return 'Good Afternoon,';
    return 'Good Evening,';
  };

  const copyMemberId = () => {
    if (user?.membershipId) {
      navigator.clipboard.writeText(user.membershipId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="relative flex items-center justify-between pt-2 pb-4 px-1">
      {/* User Info Left */}
      <div className="flex items-center gap-3.5">
        <button
          type="button"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="relative group focus:outline-none"
        >
          <div className="w-12 h-12 rounded-full bg-[#16171b] border-2 border-amber-500/80 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/10 group-hover:border-amber-400 transition-all">
            <div className="w-full h-full rounded-full bg-gradient-to-b from-[#23242a] to-[#121316] flex items-center justify-center overflow-hidden">
              <User className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          {/* Online badge */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0b0c0e] rounded-full" />
        </button>

        <div>
          <span className="text-xs font-normal text-stone-400 block tracking-wide">
            {getGreeting()}
          </span>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight">
            {user?.name || 'Valued Customer'}
          </h1>
          <p className="text-[11px] text-stone-400 mt-0.5">
            Your goals. Our priority.
          </p>
        </div>
      </div>

      {/* Action Icons Right */}
      <div className="flex items-center gap-2.5">
        {/* Notification Bell */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative w-10 h-10 rounded-full bg-[#18191f]/90 border border-stone-800 flex items-center justify-center text-stone-300 hover:text-white hover:border-amber-500/40 transition-all active:scale-95"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {/* Yellow Notification Badge */}
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
        </button>

        {/* Settings Button */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="w-10 h-10 rounded-full bg-[#18191f]/90 border border-stone-800 flex items-center justify-center text-stone-300 hover:text-white hover:border-amber-500/40 transition-all active:scale-95"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Profile Dropdown Menu */}
      {showProfileMenu && (
        <div className="absolute top-16 left-0 z-40 w-72 bg-[#16181d] border border-stone-700/80 rounded-2xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-3 pb-3 border-b border-stone-800">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <h3 className="font-semibold text-sm text-white truncate">{user?.name}</h3>
              <p className="text-xs text-stone-400 truncate">{user?.email}</p>
            </div>
          </div>

          <div className="py-3 space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-[#1c1f26]">
              <div>
                <span className="text-stone-400 block text-[10px]">Member ID</span>
                <span className="font-semibold text-white text-xs">{user?.membershipId}</span>
              </div>
              <button
                type="button"
                onClick={copyMemberId}
                className="p-1.5 rounded-md hover:bg-stone-700 text-amber-400 transition-colors"
                title="Copy Member ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-center gap-2 text-stone-400 px-1 py-1">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Verified Earner Profile</span>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-800">
            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium text-xs transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
