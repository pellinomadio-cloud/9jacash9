import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  ArrowLeft,
  Users,
  Copy,
  Check,
  Share2,
  Gift,
  TrendingUp,
  Sparkles,
  ChevronRight,
  UserCheck,
  Calendar,
} from 'lucide-react';

interface ReferralsPageProps {
  onBack: () => void;
}

export const ReferralsPage: React.FC<ReferralsPageProps> = ({ onBack }) => {
  const { user, formatNaira, getUserReferrals } = useAuth();
  const [copied, setCopied] = useState(false);

  const referralCode =
    user?.referralCode || (user?.membershipId ? `9JA-${user.membershipId}` : '9JA-VIP-777');
  const referralsList = getUserReferrals();
  const totalReferralEarnings = user?.referralEarnings || referralsList.length * 1500;
  const totalInvited = user?.referralCount || referralsList.length;

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferral = () => {
    const shareText = `Join me on 9jacash with my referral code ${referralCode} and start earning digital cash bonuses!`;
    if (navigator.share) {
      navigator.share({
        title: 'Join 9jacash',
        text: shareText,
        url: window.location.origin,
      }).catch(() => {
        copyReferralCode();
      });
    } else {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen pb-12 space-y-4">
      {/* Top Header */}
      <div className="flex items-center gap-3 pt-2 pb-3 border-b border-stone-800">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-[#16171d] border border-stone-800 flex items-center justify-center text-stone-300 hover:text-white hover:border-amber-500/50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-1.5">
            Refer &amp; Earn Rewards <Sparkles className="w-4 h-4 text-amber-400" />
          </h1>
          <p className="text-xs text-stone-400">Earn ₦1,500 instant cash for every friend you invite</p>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#17181f] via-[#241f16] to-[#2c2212] border border-amber-500/40 p-5 shadow-xl text-white">
        <div className="relative z-10 space-y-2 max-w-[70%]">
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
            REFERRAL PROGRAM
          </span>
          <h2 className="text-xl font-extrabold text-white leading-tight">
            Get ₦1,500 Instant Bonus
          </h2>
          <p className="text-xs text-stone-300 leading-relaxed">
            Give your unique code to friends. When they register, you receive ₦1,500 cash credited straight to your wallet!
          </p>
        </div>

        <div className="absolute -right-2 -bottom-2 w-28 h-28 opacity-90 flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 rounded-3xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 rotate-12 shadow-2xl">
            <Gift className="w-10 h-10" />
          </div>
        </div>
      </div>

      {/* Referral Code Box */}
      <div className="p-4 rounded-3xl bg-[#141620] border border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-stone-400 uppercase font-semibold block">
              Your Unique Referral Code
            </span>
            <span className="text-lg font-extrabold text-white font-mono tracking-wider">
              {referralCode}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copyReferralCode}
              className="py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={shareReferral}
              className="p-2 rounded-xl bg-[#1e2029] hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors cursor-pointer"
              title="Share link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {user?.referredBy && (
          <div className="pt-2 border-t border-stone-800/80 text-[11px] text-stone-400 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>You were referred by: <strong className="text-white font-mono">{user.referredBy}</strong></span>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-3xl bg-[#14151b] border border-stone-800 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>Total Referrals</span>
          </div>
          <h3 className="text-2xl font-black text-white">{totalInvited}</h3>
          <p className="text-[10px] text-stone-500">Friends registered</p>
        </div>

        <div className="p-4 rounded-3xl bg-[#14151b] border border-stone-800 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Total Earned</span>
          </div>
          <h3 className="text-2xl font-black text-emerald-400">
            {formatNaira(totalReferralEarnings)}
          </h3>
          <p className="text-[10px] text-stone-500">Paid to your balance</p>
        </div>
      </div>

      {/* How It Works Steps */}
      <div className="p-4 rounded-3xl bg-[#14151c] border border-stone-800 space-y-3">
        <h3 className="text-xs font-bold text-stone-300 uppercase tracking-wider">
          How The Referral Program Works
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center font-bold text-[11px] flex-shrink-0">
              1
            </div>
            <div>
              <h4 className="font-bold text-white">Share your code</h4>
              <p className="text-[11px] text-stone-400">Copy and share your unique referral code with family and friends.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center font-bold text-[11px] flex-shrink-0">
              2
            </div>
            <div>
              <h4 className="font-bold text-white">They Register on 9jacash</h4>
              <p className="text-[11px] text-stone-400">They enter your code in the referral field on the registration page.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-[11px] flex-shrink-0">
              3
            </div>
            <div>
              <h4 className="font-bold text-emerald-300">Instant ₦1,500 Cash</h4>
              <p className="text-[11px] text-stone-400">You automatically receive ₦1,500 instant cash reward credited to your account!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Referred Friends History */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider px-1">
          Referral Activity &amp; History ({referralsList.length})
        </h3>

        {referralsList.length === 0 ? (
          <div className="p-6 rounded-3xl bg-[#14151c] border border-stone-800/80 text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-stone-800/80 flex items-center justify-center text-stone-500">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-white">No referrals yet</p>
            <p className="text-[11px] text-stone-400">
              Share your referral code above to start earning ₦1,500 per friend!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {referralsList.map((refItem) => (
              <div
                key={refItem.id}
                className="p-3.5 rounded-2xl bg-[#14151c] border border-stone-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-sm">
                    {refItem.referredUserName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{refItem.referredUserName}</h4>
                    <p className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>{refItem.date} • {refItem.time}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-extrabold text-emerald-400 block">
                    +{formatNaira(refItem.bonusAmount)}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                    Bonus Credited
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
