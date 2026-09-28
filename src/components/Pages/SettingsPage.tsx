import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { ArrowLeft, KeyRound, Shield, FileText, LogOut, CheckCircle2, User, ChevronRight } from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
  onOpenTerms: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack, onOpenTerms }) => {
  const { user, logout } = useAuth();
  const [pinChangeOpen, setPinChangeOpen] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinChanged, setPinChanged] = useState(false);

  if (!user) return null;

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length === 4) {
      user.pin = newPin;
      localStorage.setItem('9jacash_current_session', JSON.stringify(user));
      setPinChanged(true);
      setTimeout(() => {
        setPinChanged(false);
        setPinChangeOpen(false);
        setNewPin('');
      }, 1500);
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
          <h1 className="text-lg font-bold text-white">Settings &amp; Security</h1>
          <p className="text-xs text-stone-400">Manage PIN, profile and preferences</p>
        </div>
      </div>

      {/* User Info Card */}
      <div className="p-5 rounded-3xl bg-[#15161c] border border-amber-500/30 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-amber-500/10 border-2 border-amber-500/50 flex items-center justify-center text-amber-400 font-extrabold text-xl">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="overflow-hidden">
          <h3 className="font-bold text-base text-white truncate">{user.name}</h3>
          <p className="text-xs text-stone-400 truncate">{user.email}</p>
          <span className="text-[11px] text-amber-400 font-bold block mt-0.5">
            Member ID: {user.membershipId}
          </span>
        </div>
      </div>

      {/* Settings Options */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={() => setPinChangeOpen(!pinChangeOpen)}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#15161c] border border-stone-800 hover:bg-[#1a1c24] text-xs font-bold text-stone-200 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>Change 4-Digit Password / PIN</span>
          </div>
          <span className="text-stone-500">{pinChangeOpen ? 'Close' : 'Update'}</span>
        </button>

        {pinChangeOpen && (
          <form onSubmit={handleUpdatePin} className="p-4 rounded-2xl bg-[#1a1c24] border border-amber-500/30 space-y-3">
            <label className="block text-xs font-semibold text-stone-300">Enter New 4-Digit PIN</label>
            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="••••"
              className="w-full py-3 px-3 bg-[#131418] border border-stone-700 rounded-xl text-center text-xl tracking-widest text-white focus:border-amber-500 focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={newPin.length !== 4}
              className="w-full py-3 bg-amber-400 disabled:opacity-40 text-black font-bold text-xs rounded-xl transition-all"
            >
              {pinChanged ? 'PIN Updated Successfully!' : 'Save New 4-Digit PIN'}
            </button>
          </form>
        )}

        <button
          type="button"
          onClick={onOpenTerms}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#15161c] border border-stone-800 hover:bg-[#1a1c24] text-xs font-bold text-stone-200 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Terms and Services &amp; Privacy Policy</span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-500" />
        </button>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#15161c] border border-stone-800 text-xs font-bold text-stone-200">
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Two-Factor Authentication</span>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Enabled
          </span>
        </div>
      </div>

      {/* Logout */}
      <div className="pt-4 border-t border-stone-800">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of 9jacash</span>
        </button>
      </div>
    </div>
  );
};
