import React, { useState } from 'react';
import { useAuth, TIER_LIMITS } from '../../context/AuthContext.tsx';
import {
  User,
  KeyRound,
  FileText,
  LogOut,
  ChevronRight,
  Crown,
  AlertCircle,
  Users,
  Copy,
  Check,
  Gift,
  Share2,
} from 'lucide-react';

interface MoreTabProps {
  onOpenAccountDetails: () => void;
  onOpenSettings: () => void;
  onOpenTerms: () => void;
  onOpenUpgradeTier: () => void;
  onOpenReferrals: () => void;
}

export const MoreTab: React.FC<MoreTabProps> = ({
  onOpenAccountDetails,
  onOpenSettings,
  onOpenTerms,
  onOpenUpgradeTier,
  onOpenReferrals,
}) => {
  const { user, logout, formatNaira, getUserReferrals } = useAuth();
  const [copied, setCopied] = useState(false);

  const currentTier = user?.tier || 1;
  const tierLimit = TIER_LIMITS[currentTier] || 400000;
  const pendingEarnings = user?.pendingEarnings || 0;
  const hasPendingEarnings = pendingEarnings > 0;

  const referralCode =
    user?.referralCode || (user?.membershipId ? `9JA-${user.membershipId}` : '9JA-VIP-777');
  const userReferrals = getUserReferrals();
  const totalEarned = user?.referralEarnings || userReferrals.length * 1500;
  const totalInvited = user?.referralCount || userReferrals.length;

  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-2 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white">More Options</h2>
        <p className="text-xs text-stone-400">Account services &amp; referral dashboard</p>
      </div>

      {/* Profile Card showing Member ID */}
      <div className="p-4 rounded-3xl bg-[#16171d] border border-amber-500/20 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border-2 border-amber-500/50 flex items-center justify-center text-amber-400 font-bold text-lg shadow-md">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white">{user?.name}</h3>
                {hasPendingEarnings && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                    Tier {currentTier}
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400">{user?.email}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-amber-400 font-semibold font-mono">
                  Member ID: {user?.membershipId}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tier Status & Pending Notice ONLY if users have reached Tier 1 limit / have pending earnings */}
        {hasPendingEarnings && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2.5 animate-in fade-in">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-amber-300">
                    {formatNaira(pendingEarnings)} Pending Earnings Locked
                  </p>
                  <p className="text-[10px] text-stone-300">
                    Tier {currentTier} holding limit (₦{tierLimit.toLocaleString()}) reached.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenUpgradeTier}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <Crown className="w-4 h-4" />
              <span>Upgrade Account Tier (Unlock Funds)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* REFERRAL SYSTEM SECTION ON THE MORE PAGE */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-[#171922] via-[#1a1c25] to-[#171821] border border-amber-500/30 space-y-3.5 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                Referral Program
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
                  ₦1,500 / Ref
                </span>
              </h3>
              <p className="text-[11px] text-stone-400">Earn instant cash per invited friend</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenReferrals}
            className="text-xs text-amber-400 font-bold hover:text-amber-300 flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Code Bar */}
        <div className="p-3 rounded-2xl bg-[#0e0f14] border border-stone-800 flex items-center justify-between">
          <div>
            <span className="text-[9px] text-stone-500 uppercase font-semibold block">
              My Referral Code
            </span>
            <span className="text-sm font-extrabold text-white font-mono tracking-wider">
              {referralCode}
            </span>
          </div>

          <button
            type="button"
            onClick={copyReferralCode}
            className="py-1.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Referral Quick Stats */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <div className="p-2.5 rounded-xl bg-[#13141b] border border-stone-800/80 text-center">
            <span className="text-[10px] text-stone-400 block font-medium">Invited Friends</span>
            <span className="text-base font-black text-white">{totalInvited}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#13141b] border border-stone-800/80 text-center">
            <span className="text-[10px] text-stone-400 block font-medium">Total Cash Earned</span>
            <span className="text-base font-black text-emerald-400">{formatNaira(totalEarned)}</span>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="space-y-2">
        {/* Referral Details Menu Item */}
        <button
          type="button"
          onClick={onOpenReferrals}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#16171d] border border-amber-500/20 hover:bg-[#1f212a] text-xs font-semibold text-stone-200 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-amber-400" />
            <span className="group-hover:text-white">Referral Details &amp; History</span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-500" />
        </button>

        {/* Only show Upgrade Tier menu item if user has pending earnings */}
        {hasPendingEarnings && (
          <button
            type="button"
            onClick={onOpenUpgradeTier}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#16171d] border border-amber-500/40 hover:bg-[#1f212a] text-xs font-semibold text-white transition-colors cursor-pointer group animate-in fade-in"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
                <Crown className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="group-hover:text-amber-300 font-bold text-amber-400">
                    Upgrade Account Tier
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400 text-black font-bold">
                    Action Required
                  </span>
                </div>
                <p className="text-[10px] text-stone-300 font-normal">
                  Unlock your {formatNaira(pendingEarnings)} pending earnings
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </button>
        )}

        <button
          type="button"
          onClick={onOpenAccountDetails}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#16171d] border border-stone-800/80 hover:bg-[#1f212a] text-xs font-semibold text-stone-200 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-amber-400" />
            <span>Member Profile &amp; ID</span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-500" />
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#16171d] border border-stone-800/80 hover:bg-[#1f212a] text-xs font-semibold text-stone-200 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>Security &amp; PIN Management</span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-500" />
        </button>

        <button
          type="button"
          onClick={onOpenTerms}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#16171d] border border-stone-800/80 hover:bg-[#1f212a] text-xs font-semibold text-stone-200 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Terms of Service &amp; Privacy</span>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-500" />
        </button>
      </div>

      {/* Sign Out */}
      <div className="pt-2">
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
