import React from 'react';
import { Zap, Tv, Globe, ShoppingBag, Receipt, ShieldCheck } from 'lucide-react';

interface PaymentsTabProps {
  onQuickAction: (action: 'transfer' | 'deposit' | 'withdraw' | 'admin') => void;
  onOpenAdmin?: () => void;
}

export const PaymentsTab: React.FC<PaymentsTabProps> = ({ onQuickAction, onOpenAdmin }) => {
  const paymentCategories = [
    {
      title: 'Electricity Bills',
      desc: 'IKEDC, EKEDC, AEDC, IBEDC & Disco Payments',
      icon: Zap,
      action: () => alert('Electricity bill payment hub'),
    },
    {
      title: 'Cable TV Subscription',
      desc: 'DSTV, GOTV, StarTimes & Showmax Renewal',
      icon: Tv,
      action: () => alert('Cable TV renewal hub'),
    },
    {
      title: 'Internet & Broadband',
      desc: 'Spectranet, Smile, FiberOne & Starlink Subscriptions',
      icon: Globe,
      action: () => alert('Internet broadband payment gateway'),
    },
    {
      title: 'Betting & Lottery',
      desc: 'Bet9ja, SportyBet, 1xBet & BangBet Wallets',
      icon: ShoppingBag,
      action: () => alert('Betting wallet top-up gateway'),
    },
    {
      title: 'Government & Taxes',
      desc: 'Remita, TSA, State IGR & Task Verification Gateway',
      icon: Receipt,
      action: () => {
        if (onOpenAdmin) {
          onOpenAdmin();
        } else {
          onQuickAction('admin');
        }
      },
    },
  ];

  return (
    <div className="py-2 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white">Bill Payments &amp; Utilities</h2>
        <p className="text-xs text-stone-400">Pay verified Nigerian utility bills with zero fees</p>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {paymentCategories.map((item, idx) => {
          const Icon = item.icon;
          const isGov = idx === 4;
          return (
            <button
              key={idx}
              type="button"
              onClick={item.action}
              className={`flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#16171d] border transition-all text-left group cursor-pointer ${
                isGov
                  ? 'border-stone-800/80 hover:border-amber-400/60 hover:bg-[#1a1b24]'
                  : 'border-stone-800/80 hover:border-amber-500/40 hover:bg-[#1c1e27]'
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-[#1f212a] border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform flex-shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>
                  {isGov && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                      Admin Tasks
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-stone-400">{item.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
