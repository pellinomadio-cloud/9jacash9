import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  ArrowLeft,
  Crown,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  TrendingUp,
  Wallet,
  AlertCircle,
} from 'lucide-react';

interface UpgradeTierPageProps {
  onBack: () => void;
}

export const UpgradeTierPage: React.FC<UpgradeTierPageProps> = ({ onBack }) => {
  const { user, companyAccount, formatNaira, upgradeTier } = useAuth();
  const currentTier = user?.tier || 1;

  const [selectedTier, setSelectedTier] = useState<number>(currentTier === 1 ? 2 : 3);
  const [step, setStep] = useState<'plans' | 'payment' | 'success'>('plans');
  const [copied, setCopied] = useState<string | null>(null);
  const [senderName, setSenderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [upgradeError, setUpgradeError] = useState('');

  const tierDetails: Record<
    number,
    {
      title: string;
      price: number;
      holdingLimit: number;
      holdingLimitFormatted: string;
      color: string;
      badge: string;
      features: string[];
    }
  > = {
    1: {
      title: 'Tier 1 Account',
      price: 0,
      holdingLimit: 400000,
      holdingLimitFormatted: '₦400,000',
      color: 'from-stone-700 to-stone-900',
      badge: 'Starter Level',
      features: [
        'Maximum wallet holding: ₦400,000',
        'Earnings beyond ₦400,000 placed in Pending',
        'Standard bank transfers',
      ],
    },
    2: {
      title: 'Tier 2 Account',
      price: 6600,
      holdingLimit: 2000000,
      holdingLimitFormatted: '₦2,000,000 (2 Million)',
      color: 'from-amber-600 to-amber-900',
      badge: 'Most Popular Upgrade',
      features: [
        'Maximum wallet holding: ₦2,000,000',
        'Instant release of held pending earnings',
        'Priority Quick Code clearing queue',
        'Higher daily task rewards capacity',
      ],
    },
    3: {
      title: 'Tier 3 Account (VIP)',
      price: 8000,
      holdingLimit: 5000000,
      holdingLimitFormatted: '₦5,000,000 (5 Million)',
      color: 'from-yellow-500 via-amber-600 to-stone-950',
      badge: 'VIP Maximum Tier',
      features: [
        'Maximum wallet holding: ₦5,000,000',
        'Unlimited earning capacity without restrictions',
        'VIP priority bank withdrawal clearance',
        'Instant release of all pending funds',
      ],
    },
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleConfirmUpgrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim()) {
      setUpgradeError('Please enter the bank account / sender name used for the transfer.');
      return;
    }
    setUpgradeError('');
    setIsProcessing(true);

    setTimeout(() => {
      const res = upgradeTier(selectedTier, `Upgrade_Tier_${selectedTier}_${senderName.trim()}`);
      setIsProcessing(false);
      if (res.success) {
        setStep('success');
      } else {
        setUpgradeError(res.message || 'Upgrade failed. Please try again.');
      }
    }, 1500);
  };

  const activePlan = tierDetails[selectedTier];
  const pendingFunds = user?.pendingEarnings || 0;

  return (
    <div className="min-h-screen pb-12 space-y-4">
      {/* Top Header */}
      <div className="flex items-center gap-3 pt-2 pb-3 border-b border-stone-800">
        <button
          type="button"
          onClick={() => {
            if (step === 'payment') setStep('plans');
            else onBack();
          }}
          className="w-10 h-10 rounded-full bg-[#16171d] border border-stone-800 flex items-center justify-center text-stone-300 hover:text-white hover:border-amber-500/50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-1.5">
            Account Tier Upgrade <Crown className="w-4 h-4 text-amber-400" />
          </h1>
          <p className="text-xs text-stone-400">
            {step === 'plans' && 'Increase your wallet holding capacity & unlock pending funds'}
            {step === 'payment' && `Payment for Tier ${selectedTier} Upgrade`}
            {step === 'success' && 'Upgrade Successful!'}
          </p>
        </div>
      </div>

      {/* Pending Earnings Banner if user has any */}
      {pendingFunds > 0 && (
        <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-black flex items-center justify-center font-bold flex-shrink-0 shadow-md">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-300">
                {formatNaira(pendingFunds)} in Pending Earnings
              </h4>
              <p className="text-[11px] text-stone-300">
                Tier {currentTier} limit reached. Upgrade to Tier 2 or 3 to instantly credit this to your balance!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: PLANS SELECTION */}
      {step === 'plans' && (
        <div className="space-y-3.5">
          {/* Current Status Card */}
          <div className="p-4 rounded-3xl bg-[#14161f] border border-stone-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold block">
                Current Level
              </span>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5 mt-0.5">
                Tier {currentTier} Account
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  Active
                </span>
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Balance Limit: <strong className="text-amber-400">{tierDetails[currentTier].holdingLimitFormatted}</strong>
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              <Crown className="w-6 h-6" />
            </div>
          </div>

          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider px-1">
            Choose Upgrade Tier
          </h3>

          {/* Tier 2 Option */}
          <div
            onClick={() => currentTier < 2 && setSelectedTier(2)}
            className={`p-4 rounded-3xl border transition-all relative ${
              currentTier >= 2
                ? 'bg-[#111216] border-stone-800 opacity-60 cursor-default'
                : selectedTier === 2
                ? 'bg-[#1a1b24] border-amber-400 shadow-xl shadow-amber-500/10 cursor-pointer'
                : 'bg-[#14151c] border-stone-800/90 hover:border-stone-700 cursor-pointer'
            }`}
          >
            {currentTier < 2 && (
              <span className="absolute -top-2.5 right-4 text-[10px] px-2.5 py-0.5 rounded-full bg-amber-400 text-black font-bold uppercase tracking-wide shadow-sm">
                Recommended
              </span>
            )}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm">Tier 2 Account</h4>
                  {currentTier >= 2 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-400">
                      Already Unlocked
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  Balance holding capacity up to <strong className="text-white">₦2,000,000</strong>
                </p>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-amber-400">₦6,600</span>
                <span className="block text-[10px] text-stone-500">One-time upgrade</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-stone-800/80 space-y-1.5 text-[11px] text-stone-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>Wallet holds up to ₦2,000,000 Naira</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>Immediately credits any held pending earnings</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>Priority processing for all bank withdrawals</span>
              </div>
            </div>

            {currentTier < 2 && (
              <div className="mt-3 pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTier(2);
                    setStep('payment');
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Upgrade to Tier 2 (₦6,600)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Tier 3 Option */}
          <div
            onClick={() => currentTier < 3 && setSelectedTier(3)}
            className={`p-4 rounded-3xl border transition-all relative ${
              currentTier >= 3
                ? 'bg-[#111216] border-stone-800 opacity-60 cursor-default'
                : selectedTier === 3
                ? 'bg-[#1e1c28] border-amber-400 shadow-xl shadow-amber-500/10 cursor-pointer'
                : 'bg-[#14151c] border-stone-800/90 hover:border-stone-700 cursor-pointer'
            }`}
          >
            <span className="absolute -top-2.5 right-4 text-[10px] px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 text-black font-bold uppercase tracking-wide shadow-sm">
              VIP Unlimited
            </span>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-sm">Tier 3 Account (VIP)</h4>
                  {currentTier >= 3 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-400">
                      Already Unlocked
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-400 mt-0.5">
                  Balance holding capacity up to <strong className="text-white">₦5,000,000</strong>
                </p>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-amber-400">₦8,000</span>
                <span className="block text-[10px] text-stone-500">One-time upgrade</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-stone-800/80 space-y-1.5 text-[11px] text-stone-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>Maximum wallet capacity: ₦5,000,000 Naira</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>Unrestricted daily earning &amp; task limits</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>VIP fast-track automated withdrawals</span>
              </div>
            </div>

            {currentTier < 3 && (
              <div className="mt-3 pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTier(3);
                    setStep('payment');
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Upgrade to Tier 3 (₦8,000)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 2: PAYMENT TO COMPANY ACCOUNT */}
      {step === 'payment' && activePlan && (
        <form onSubmit={handleConfirmUpgrade} className="space-y-4">
          <div className="p-4 rounded-3xl bg-[#161822] border border-amber-500/40 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
              <div>
                <span className="text-[10px] text-amber-400 font-semibold uppercase">Selected Tier</span>
                <h3 className="font-bold text-white text-sm">{activePlan.title}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-400 block">Upgrade Fee</span>
                <span className="text-base font-extrabold text-amber-400">
                  {formatNaira(activePlan.price)}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              Transfer exactly <strong>{formatNaira(activePlan.price)}</strong> to the official 9jacash account below:
            </p>

            {/* Account Box */}
            <div className="p-3.5 rounded-2xl bg-[#0f1014] border border-stone-800 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Bank Name</span>
                <span className="text-white font-semibold">{companyAccount.bankName}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-400">Account Number</span>
                <div className="flex items-center gap-2">
                  <span className="text-amber-300 font-mono font-bold tracking-wider">
                    {companyAccount.accountNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(companyAccount.accountNumber, 'acc_num')}
                    className="p-1 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                  >
                    {copied === 'acc_num' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-400">Account Name</span>
                <span className="text-white font-semibold">{companyAccount.accountName}</span>
              </div>
            </div>
          </div>

          {/* Sender Name Input */}
          <div className="p-4 rounded-3xl bg-[#14151c] border border-stone-800 space-y-3">
            <label className="block text-xs font-semibold text-white">
              Sender Account Name / Reference <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="e.g. Chukwuma Emmanuel"
              className="w-full py-3 px-4 rounded-2xl bg-[#0e0f14] border border-stone-700 text-white text-xs placeholder-stone-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            <p className="text-[11px] text-stone-400">
              Enter the exact name on your bank account used to transfer the upgrade fee.
            </p>
          </div>

          {upgradeError && (
            <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
              {upgradeError}
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing || !senderName.trim()}
            className={`w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              isProcessing || !senderName.trim()
                ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                : 'bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-400/20 cursor-pointer'
            }`}
          >
            {isProcessing ? (
              <span>Activating Tier {selectedTier} Upgrade...</span>
            ) : (
              <>
                <span>Confirm &amp; Activate Tier {selectedTier}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* STEP 3: SUCCESS */}
      {step === 'success' && activePlan && (
        <div className="p-6 rounded-3xl bg-[#141620] border border-amber-500/50 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-amber-400 text-black flex items-center justify-center mx-auto shadow-xl shadow-amber-400/30">
            <Crown className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Upgrade Activated! 🎉</h3>
            <p className="text-xs text-amber-300 font-medium">
              Your account is now upgraded to <strong>Tier {selectedTier}</strong>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0e0f14] border border-stone-800 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-stone-400">New Holding Capacity:</span>
              <span className="text-white font-bold">{activePlan.holdingLimitFormatted}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Current Balance:</span>
              <span className="text-emerald-400 font-bold">{formatNaira(user?.balance || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Remaining Pending:</span>
              <span className="text-stone-300 font-medium">{formatNaira(user?.pendingEarnings || 0)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition-colors cursor-pointer shadow-lg"
          >
            Return to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};
