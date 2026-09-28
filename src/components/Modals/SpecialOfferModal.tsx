import React from 'react';
import { X, Sparkles, Percent, CheckCircle2, ArrowRight } from 'lucide-react';

interface SpecialOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimOffer: () => void;
}

export const SpecialOfferModal: React.FC<SpecialOfferModalProps> = ({
  isOpen,
  onClose,
  onClaimOffer,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#14151b] border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-stone-200">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Artwork */}
        <div className="text-center pt-2 pb-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-black font-extrabold shadow-xl shadow-amber-500/20 mb-3">
            <Percent className="w-8 h-8 stroke-[2.8]" />
          </div>
          <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
            EXCLUSIVE REWARD
          </span>
          <h3 className="text-xl font-extrabold text-white mt-1">
            5% Unlimited Cashback
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Earn real Naira rewards instantly back into your 9jacash balance!
          </p>
        </div>

        {/* Benefits list */}
        <div className="py-2 space-y-2.5 text-xs">
          <div className="p-3 rounded-xl bg-[#1c1e26] border border-stone-800 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-white">All Airtime &amp; Data Networks</h4>
              <p className="text-stone-400 text-[11px]">MTN, Airtel, Glo, and 9mobile top-ups are 100% eligible.</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#1c1e26] border border-stone-800 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-white">Zero Cap &amp; Instant Credit</h4>
              <p className="text-stone-400 text-[11px]">No waiting days or hidden fees. Cashback lands immediately.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 mt-2 border-t border-stone-800 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 text-xs font-semibold"
          >
            Maybe Later
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onClaimOffer();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all"
          >
            <span>Top Up Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
