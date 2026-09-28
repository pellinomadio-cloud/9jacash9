import React, { useState } from 'react';
import { Sparkles, Plus, CreditCard, Hash, Copy, Check, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

interface QuickActionsProps {
  onActionClick: (action: 'earn' | 'deposit' | 'withdraw' | 'quickcode') => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  const { user } = useAuth();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Normalize active quick codes
  const activeQuickCodes: { code: string; planName: string; withdrawalsLeft: number }[] = (user?.quickCodes || []).map((item) => {
    if (typeof item === 'string') {
      return { code: item, planName: 'Quick Code', withdrawalsLeft: 1 };
    }
    return item;
  });

  const primaryCode = activeQuickCodes.length > 0 ? activeQuickCodes[0] : null;

  const handleCopy = (code: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  const actions = [
    {
      id: 'earn' as const,
      title: 'Earn',
      subtitle: 'Rewards & cash',
      icon: Sparkles,
      iconRotate: '',
    },
    {
      id: 'deposit' as const,
      title: 'Deposit',
      subtitle: 'Add funds',
      icon: Plus,
      iconRotate: '',
    },
    {
      id: 'withdraw' as const,
      title: 'Withdraw',
      subtitle: 'Send to bank',
      icon: CreditCard,
      iconRotate: '',
    },
    {
      id: 'quickcode' as const,
      title: 'Quick Code',
      subtitle: 'USSD & offline',
      icon: Hash,
      iconRotate: '',
    },
  ] as const;

  return (
    <div className="space-y-2.5 py-1">
      {/* 4 Action Buttons Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 items-start">
        {actions.map((act) => {
          const IconComponent = act.icon;
          const isQuickCode = act.id === 'quickcode';

          return (
            <div key={act.id} className="flex flex-col items-center text-center">
              <button
                type="button"
                onClick={() => onActionClick(act.id)}
                className="w-full flex flex-col items-center text-center group cursor-pointer focus:outline-none"
              >
                {/* Circular Dark Button with gold border & subtle glow */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#18191f] border border-amber-500/40 flex items-center justify-center shadow-lg shadow-black/40 group-hover:border-amber-400 group-hover:bg-[#20222a] group-hover:shadow-amber-500/20 group-active:scale-95 transition-all duration-200">
                  <IconComponent
                    className={`w-6 h-6 sm:w-7 sm:h-7 text-amber-400 ${act.iconRotate} group-hover:scale-110 transition-transform`}
                  />
                  {/* Badge on Quick Code button if active code exists */}
                  {isQuickCode && primaryCode && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-400 text-black font-extrabold text-[9px] items-center justify-center">
                        {activeQuickCodes.length}
                      </span>
                    </span>
                  )}
                </div>

                {/* Title */}
                <span className="mt-2 text-xs sm:text-sm font-semibold text-white group-hover:text-amber-400 transition-colors">
                  {act.title}
                </span>

                {/* Subtitle */}
                <span className="text-[10px] sm:text-[11px] text-stone-400 font-normal mt-0.5">
                  {act.subtitle}
                </span>
              </button>

              {/* Directly under Dashboard Quick Code button: Show Code & Small Copy Button */}
              {isQuickCode && primaryCode && (
                <div className="mt-1.5 w-full max-w-[96px] p-1 rounded-xl bg-amber-500/10 border border-amber-500/40 flex flex-col items-center text-center shadow-sm">
                  <span className="font-extrabold text-[10px] sm:text-[11px] text-amber-400 tracking-wider break-all">
                    {primaryCode.code}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleCopy(primaryCode.code, e)}
                    className="mt-1 px-1.5 py-0.5 w-full rounded-md bg-amber-400 hover:bg-amber-300 text-black font-bold text-[9px] flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
                    title="Copy Quick Code"
                  >
                    {copiedCode === primaryCode.code ? (
                      <>
                        <Check className="w-2.5 h-2.5 text-black stroke-[3]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-2.5 h-2.5 stroke-[2.5]" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Prominent Active Quick Code Notification Card if any active quick codes exist */}
      {activeQuickCodes.length > 0 && (
        <div className="mt-1 p-3 rounded-2xl bg-gradient-to-r from-[#181a22] via-[#1f1d19] to-[#16171d] border border-amber-500/40 shadow-lg shadow-black/40 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                Approved Quick Code Ready
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
              {activeQuickCodes[0].withdrawalsLeft} withdrawal{activeQuickCodes[0].withdrawalsLeft > 1 ? 's' : ''} left
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#111217] border border-stone-800">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm sm:text-base tracking-widest px-2 py-0.5 bg-[#1b1c24] rounded-lg border border-stone-700">
                {activeQuickCodes[0].code}
              </span>
              <span className="text-[11px] text-stone-400 hidden sm:inline">
                {activeQuickCodes[0].planName}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => handleCopy(activeQuickCodes[0].code, e)}
                className="py-1.5 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm active:scale-95"
              >
                {copiedCode === activeQuickCodes[0].code ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onActionClick('withdraw')}
                className="py-1.5 px-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer"
                title="Use code in Withdrawal"
              >
                <span>Withdraw</span>
                <ArrowRight className="w-3 h-3 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
