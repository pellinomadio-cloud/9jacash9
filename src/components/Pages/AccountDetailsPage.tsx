import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { ArrowLeft, User, Copy, Check, Share2, ShieldCheck, Sparkles, Award } from 'lucide-react';

interface AccountDetailsPageProps {
  onBack: () => void;
}

export const AccountDetailsPage: React.FC<AccountDetailsPageProps> = ({ onBack }) => {
  const { user, formatNaira } = useAuth();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!user) return null;

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
            Member Profile <User className="w-4 h-4 text-amber-400" />
          </h1>
          <p className="text-xs text-stone-400">Your official 9jacash earner credentials</p>
        </div>
      </div>

      {/* Luxury Member Card Pass */}
      <div className="p-6 rounded-3xl bg-gradient-to-tr from-[#14151b] via-[#1a1c24] to-[#252015] border border-amber-500/40 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black flex items-center justify-center font-extrabold shadow-lg shadow-amber-400/20">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">
                9JACASH EARNER
              </span>
              <span className="text-xs text-stone-400">Rewards &amp; Cash Member</span>
            </div>
          </div>
          <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
            Active Member
          </span>
        </div>

        {/* Member Details */}
        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#131418] border border-stone-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-stone-500 uppercase block font-semibold">Member ID</span>
              <span className="text-xl font-bold text-white tracking-wider">{user.membershipId}</span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(user.membershipId, 'mid')}
              className="py-1.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedField === 'mid' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedField === 'mid' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#131418] border border-stone-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-stone-500 uppercase block font-semibold">Full Name</span>
              <span className="text-sm font-bold text-white">{user.name}</span>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(user.name, 'name')}
              className="p-1.5 rounded-lg text-stone-400 hover:text-amber-400 transition-colors"
            >
              {copiedField === 'name' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#131418] border border-stone-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-stone-500 uppercase block font-semibold">Registered Email</span>
              <span className="text-sm font-bold text-amber-400">{user.email}</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">Verified</span>
          </div>
        </div>

        {/* Earning Level & Quick Codes */}
        <div className="pt-2 border-t border-stone-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Standard Earner Status</span>
            </div>
            <span className="text-amber-400 font-semibold">Balance: {formatNaira(user.balance)}</span>
          </div>

          {/* Active Quick Codes list */}
          <div className="p-3.5 rounded-2xl bg-[#131418] border border-amber-500/30 space-y-2">
            <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block">
              Your Active Withdrawal Quick Codes
            </span>
            {user.quickCodes && user.quickCodes.length > 0 ? (
              <div className="space-y-2 pt-1">
                {user.quickCodes.map((item, idx) => {
                  const isStr = typeof item === 'string';
                  const code = isStr ? item : item.code;
                  const planName = isStr ? 'Quick Code' : item.planName;
                  const withdrawalsLeft = isStr ? 1 : item.withdrawalsLeft;

                  return (
                    <div key={idx} className="p-3 rounded-xl bg-[#1c1e26] border border-stone-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-white text-sm tracking-widest">{code}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(code, `qc_${idx}`)}
                          className="py-1 px-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          {copiedField === `qc_${idx}` ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === `qc_${idx}` ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-stone-400 font-medium">{planName}</span>
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
                          {withdrawalsLeft} withdrawal{withdrawalsLeft > 1 ? 's' : ''} left
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[11px] text-stone-400 italic py-1">
                No active quick codes yet. Purchase and get admin approval to receive your withdrawal quick code here.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          onClick={handleShare}
          className="p-3.5 rounded-2xl bg-[#16171d] border border-stone-800 hover:border-amber-500/40 text-stone-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-amber-400" />
          <span>Share Profile</span>
        </button>
        <button
          type="button"
          onClick={onBack}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-black text-xs font-bold shadow-md shadow-amber-500/20 flex items-center justify-center transition-all cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};
