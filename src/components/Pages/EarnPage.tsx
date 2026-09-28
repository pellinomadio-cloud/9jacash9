import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { ArrowLeft, Sparkles, Gift, Share2, Copy, Check, Users, Trophy, DollarSign, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

interface EarnPageProps {
  onBack: () => void;
}

export const EarnPage: React.FC<EarnPageProps> = ({ onBack }) => {
  const { user, addTransaction, formatNaira } = useAuth();
  const [copied, setCopied] = useState(false);
  const [claimedDaily, setClaimedDaily] = useState(false);
  const [rewardClaimedAmount, setRewardClaimedAmount] = useState<number | null>(null);

  const referralCode =
    user?.referralCode || (user?.membershipId ? `9JA-${user.membershipId}` : '9JA-VIP-777');

  const copyReferral = () => {
    navigator.clipboard.writeText(`Join 9jacash with my referral code ${referralCode} and get instant bonuses!`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const claimDailyReward = () => {
    if (claimedDaily) return;
    const dailyBonus = 500;
    addTransaction({
      type: 'earn',
      title: 'Daily Check-in Reward',
      subtitle: 'Day 1 Streak Bonus',
      amount: dailyBonus,
      isCredit: true,
      status: 'successful',
    });
    setClaimedDaily(true);
    setRewardClaimedAmount(dailyBonus);
  };

  const claimSpinReward = (amount: number, title: string) => {
    addTransaction({
      type: 'earn',
      title: title,
      subtitle: '9jacash Lucky Reward',
      amount: amount,
      isCredit: true,
      status: 'successful',
    });
    setRewardClaimedAmount(amount);
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
            Earn Cash &amp; Rewards <Sparkles className="w-4 h-4 text-amber-400" />
          </h1>
          <p className="text-xs text-stone-400">Complete tasks, check in daily &amp; invite friends</p>
        </div>
      </div>

      {/* Success Notification Alert */}
      {rewardClaimedAmount && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Successfully claimed <strong>+{formatNaira(rewardClaimedAmount)}</strong> to your balance!</span>
          </div>
          <button
            type="button"
            onClick={() => setRewardClaimedAmount(null)}
            className="text-stone-400 hover:text-white ml-2 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#17181f] via-[#211f19] to-[#2b2414] border border-amber-500/40 p-5 shadow-xl text-white">
        <div className="relative z-10 space-y-2 max-w-[70%]">
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
            9JACASH REWARDS CLUB
          </span>
          <h2 className="text-xl font-extrabold text-white leading-tight">
            Earn up to ₦50,000 Weekly
          </h2>
          <p className="text-xs text-stone-300 leading-relaxed">
            Invite friends to 9jacash and earn ₦1,500 instant cash every time they register.
          </p>
        </div>

        <div className="absolute -right-2 -bottom-2 w-28 h-28 opacity-90 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-black font-extrabold shadow-2xl rotate-12">
            <Gift className="w-10 h-10 stroke-[2]" />
          </div>
        </div>
      </div>

      {/* Daily Check-in Card */}
      <div className="p-4 rounded-3xl bg-[#15161c] border border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Daily Check-in Streak</h3>
              <p className="text-[11px] text-stone-400">Claim free ₦500 every day</p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-400">Day 1 / 7</span>
        </div>

        {/* Days Bar */}
        <div className="grid grid-cols-7 gap-1.5 pt-1">
          {['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'].map((day, idx) => (
            <div
              key={day}
              className={`p-2 rounded-xl text-center border transition-all ${
                idx === 0 && claimedDaily
                  ? 'bg-amber-400 text-black border-amber-400 font-bold'
                  : idx === 0
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 font-bold'
                  : 'bg-[#1c1e26] text-stone-500 border-stone-800'
              }`}
            >
              <span className="block text-[9px] uppercase">{day}</span>
              <span className="text-[10px] font-semibold">{idx === 6 ? '₦2,000' : '₦500'}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          disabled={claimedDaily}
          onClick={claimDailyReward}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 disabled:opacity-50 text-black font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {claimedDaily ? (
            <>
              <Check className="w-4 h-4" />
              <span>Claimed for Today!</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Claim Today's ₦500 Bonus</span>
            </>
          )}
        </button>
      </div>

      {/* Referral Link Box */}
      <div className="p-4 rounded-3xl bg-[#15161c] border border-stone-800 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Your Referral Code</h3>
            <p className="text-[11px] text-stone-400">Share with family &amp; friends</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#1c1e26] border border-stone-800">
          <div>
            <span className="text-[10px] text-stone-500 uppercase block font-semibold">Referral Code</span>
            <span className="text-base font-bold text-white tracking-widest">{referralCode}</span>
          </div>

          <button
            type="button"
            onClick={copyReferral}
            className="py-1.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Quick Reward Tasks */}
      <div className="space-y-2.5">
        <h3 className="text-sm font-bold text-white">Reward Missions</h3>

        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#15161c] border border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Welcome Gift Pack</h4>
              <p className="text-[11px] text-stone-400">New registration special bonus</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => claimSpinReward(1000, 'Welcome Gift Pack Bonus')}
            className="py-1.5 px-3 rounded-xl bg-[#1e2029] hover:bg-amber-500/20 border border-stone-700 hover:border-amber-500/50 text-amber-400 text-xs font-semibold transition-all"
          >
            Claim ₦1,000
          </button>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#15161c] border border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">First Transfer Reward</h4>
              <p className="text-[11px] text-stone-400">Complete any transfer or deposit to your account</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => claimSpinReward(750, 'First Transaction Mission Bonus')}
            className="py-1.5 px-3 rounded-xl bg-[#1e2029] hover:bg-amber-500/20 border border-stone-700 hover:border-amber-500/50 text-amber-400 text-xs font-semibold transition-all"
          >
            Claim ₦750
          </button>
        </div>
      </div>
    </div>
  );
};
