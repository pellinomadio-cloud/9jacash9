import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { X, Copy, Check, User, ShieldCheck, Share2, Award } from 'lucide-react';

interface AccountDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountDetailsModal: React.FC<AccountDetailsModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My 9jacash Member Profile',
        text: `Member Name: ${user.name}\nMember ID: ${user.membershipId}\nEmail: ${user.email}`,
      }).catch(() => {});
    } else {
      copyToClipboard(`Member Name: ${user.name}\nMember ID: ${user.membershipId}\nEmail: ${user.email}`, 'all');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#14151b] border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-black font-bold shadow-md shadow-amber-400/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Member Profile</h3>
              <p className="text-xs text-stone-400">Your 9jacash Earner Credentials</p>
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

        {/* Member Info Box */}
        <div className="py-5 space-y-3.5">
          {/* Member ID */}
          <div className="p-3.5 rounded-2xl bg-[#1c1e26] border border-stone-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-stone-400 uppercase tracking-wider block font-semibold">
                Member ID
              </span>
              <span className="text-lg font-bold text-white tracking-wider">
                {user.membershipId}
              </span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(user.membershipId, 'mid')}
              className="py-1.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedField === 'mid' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedField === 'mid' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Full Name */}
          <div className="p-3.5 rounded-2xl bg-[#1c1e26] border border-stone-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-stone-400 uppercase tracking-wider block font-semibold">
                Full Name
              </span>
              <span className="text-sm font-semibold text-white">
                {user.name}
              </span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(user.name, 'name')}
              className="p-1.5 rounded-lg text-stone-400 hover:text-amber-400 transition-colors"
            >
              {copiedField === 'name' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Registered Email */}
          <div className="p-3.5 rounded-2xl bg-[#1c1e26] border border-stone-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-stone-400 uppercase tracking-wider block font-semibold">
                Registered Email
              </span>
              <span className="text-sm font-semibold text-amber-400">
                {user.email}
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Active Earner
            </span>
          </div>

          {/* Earner Status */}
          <div className="flex items-center justify-between px-2 text-xs text-stone-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Verified Earner Member</span>
            </span>
            <span>Standard Membership</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-stone-800 flex gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 py-3 px-4 rounded-xl bg-[#1c1e26] hover:bg-[#252834] border border-stone-700 text-stone-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-amber-400" />
            <span>Share Details</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
