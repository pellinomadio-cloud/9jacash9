import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { X, User, KeyRound, Shield, FileText, LogOut, Moon, Bell, HelpCircle, Check, Smartphone } from 'lucide-react';
import { TermsModal } from '../Auth/TermsModal.tsx';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const [showTerms, setShowTerms] = useState(false);
  const [pinChangeOpen, setPinChangeOpen] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinChanged, setPinChanged] = useState(false);

  if (!isOpen || !user) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#14151b] border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-2xl text-stone-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div>
            <h3 className="font-bold text-lg text-white">Settings &amp; Security</h3>
            <p className="text-xs text-stone-400">Manage your 9jacash account</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="my-4 p-4 rounded-2xl bg-[#1c1e26] border border-stone-800 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border-2 border-amber-500/50 flex items-center justify-center text-amber-400 font-bold text-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <h4 className="font-bold text-sm text-white truncate">{user.name}</h4>
            <p className="text-xs text-stone-400 truncate">{user.email}</p>
            <span className="inline-block text-[10px] text-amber-400 font-medium mt-0.5">
              Member ID: {user.membershipId}
            </span>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-2 py-2">
          {/* Change PIN toggle */}
          <button
            type="button"
            onClick={() => setPinChangeOpen(!pinChangeOpen)}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#171920] border border-stone-800/80 hover:bg-[#1f212a] text-xs font-semibold text-stone-200 transition-colors"
          >
            <div className="flex items-center gap-3">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>Change 4-Digit Password / PIN</span>
            </div>
            <span className="text-stone-500 text-[11px]">{pinChangeOpen ? 'Hide' : 'Edit'}</span>
          </button>

          {pinChangeOpen && (
            <form onSubmit={handleUpdatePin} className="p-3.5 rounded-2xl bg-[#1c1e26] border border-amber-500/30 space-y-3">
              <label className="block text-[11px] text-stone-300">Enter New 4-Digit PIN</label>
              <input
                type="password"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="••••"
                className="w-full py-2 px-3 bg-[#131418] border border-stone-700 rounded-xl text-center text-lg tracking-widest text-white font-bold focus:border-amber-500 focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={newPin.length !== 4}
                className="w-full py-2 bg-amber-400 disabled:opacity-40 text-black font-bold text-xs rounded-xl transition-all"
              >
                {pinChanged ? 'PIN Updated Successfully!' : 'Save New PIN'}
              </button>
            </form>
          )}

          {/* Terms & Privacy */}
          <button
            type="button"
            onClick={() => setShowTerms(true)}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#171920] border border-stone-800/80 hover:bg-[#1f212a] text-xs font-semibold text-stone-200 transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Terms and Services</span>
            </div>
            <span className="text-stone-500 text-[11px]">View</span>
          </button>

          {/* Security details */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#171920] border border-stone-800/80 text-xs font-semibold text-stone-200">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Two-Factor Authentication (PIN)</span>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
        </div>

        {/* Logout */}
        <div className="pt-4 mt-2 border-t border-stone-800">
          <button
            type="button"
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out of 9jacash</span>
          </button>
        </div>
      </div>

      <TermsModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={() => setShowTerms(false)}
      />
    </div>
  );
};
