import React from 'react';
import { X, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#141518] border border-amber-500/20 rounded-2xl p-6 shadow-2xl text-stone-200">
        <div className="flex items-center justify-between pb-4 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Terms & Services</h3>
              <p className="text-xs text-stone-400">9jacash Digital Financial Services</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto text-sm text-stone-300 pr-2">
          <div className="bg-[#1a1c21] p-3 rounded-xl border border-stone-800">
            <h4 className="font-semibold text-amber-400 mb-1">1. Account Security & 4-Digit PIN</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              You are responsible for keeping your 4-digit PIN confidential. 9jacash will never call, message, or email you to request your security PIN.
            </p>
          </div>

          <div className="bg-[#1a1c21] p-3 rounded-xl border border-stone-800">
            <h4 className="font-semibold text-amber-400 mb-1">2. Transactions & Funds</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              All transfers, deposits, and airtime transactions processed via 9jacash are governed by standard regulatory banking and consumer protection standards.
            </p>
          </div>

          <div className="bg-[#1a1c21] p-3 rounded-xl border border-stone-800">
            <h4 className="font-semibold text-amber-400 mb-1">3. Privacy & Data Protection</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              We encrypt your personal credentials and banking details with high-level encryption to ensure end-to-end data security.
            </p>
          </div>

          <div className="bg-[#1a1c21] p-3 rounded-xl border border-stone-800">
            <h4 className="font-semibold text-amber-400 mb-1">4. Cashback & Special Promotions</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Cashback rewards earned on eligible airtime and data purchases are credited directly to your main 9jacash balance.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-800 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-stone-700 text-stone-300 hover:bg-stone-800 font-medium text-sm transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onAccept();
              onClose();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Accept Terms
          </button>
        </div>
      </div>
    </div>
  );
};
