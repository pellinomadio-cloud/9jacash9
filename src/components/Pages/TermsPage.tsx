import React from 'react';
import { ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface TermsPageProps {
  onBack: () => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onBack }) => {
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
            Terms &amp; Services <ShieldCheck className="w-4 h-4 text-amber-400" />
          </h1>
          <p className="text-xs text-stone-400">9jacash Digital Financial Services Agreement</p>
        </div>
      </div>

      <div className="space-y-3 text-xs text-stone-300">
        <div className="p-4 rounded-2xl bg-[#15161c] border border-stone-800 space-y-1.5">
          <h3 className="font-bold text-amber-400 text-sm">1. Account Security &amp; PIN</h3>
          <p className="text-stone-400 leading-relaxed">
            Your 4-digit password/PIN is strictly confidential. You are responsible for all transfers, withdrawals, and commands authorized using your secret credentials.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#15161c] border border-stone-800 space-y-1.5">
          <h3 className="font-bold text-amber-400 text-sm">2. Instant Transfers &amp; Settlements</h3>
          <p className="text-stone-400 leading-relaxed">
            All transfers and deposits made through 9jacash are processed via the Central Bank of Nigeria NIP settlement network and partners.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#15161c] border border-stone-800 space-y-1.5">
          <h3 className="font-bold text-amber-400 text-sm">3. 5% Cashback Rewards Program</h3>
          <p className="text-stone-400 leading-relaxed">
            Cashback bonuses accumulated through airtime purchases are credited in real-time as spendable funds in your 9jacash balance.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#15161c] border border-stone-800 space-y-1.5">
          <h3 className="font-bold text-amber-400 text-sm">4. Privacy &amp; Data Encryption</h3>
          <p className="text-stone-400 leading-relaxed">
            We employ bank-grade encryption protocols to safeguard your personal data, balance information, and transaction records.
          </p>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="button"
          onClick={onBack}
          className="w-full py-3.5 rounded-2xl bg-amber-400 text-black font-bold text-xs shadow-md shadow-amber-400/20"
        >
          I Understand &amp; Agree
        </button>
      </div>
    </div>
  );
};
