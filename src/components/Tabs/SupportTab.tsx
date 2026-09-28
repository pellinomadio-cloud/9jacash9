import React from 'react';
import { Headphones, MessageSquare, PhoneCall, Mail, ShieldCheck, Sparkles, Bot } from 'lucide-react';

interface SupportTabProps {
  onStartLiveChat: () => void;
}

export const SupportTab: React.FC<SupportTabProps> = ({ onStartLiveChat }) => {
  return (
    <div className="py-2 space-y-4">
      <div>
        <h2 className="text-xl font-bold text-white">Help &amp; Support</h2>
        <p className="text-xs text-stone-400">24/7 dedicated customer care for 9jacash</p>
      </div>

      {/* Support Card Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#181920] to-[#221f18] border border-amber-500/30 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black flex items-center justify-center font-bold flex-shrink-0 shadow-lg shadow-amber-400/20">
          <Headphones className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">Priority Support Active</h3>
          <p className="text-xs text-stone-400 mt-0.5">Average response time under 2 minutes</p>
        </div>
      </div>

      {/* Primary In-App Live Chat CTA Button */}
      <button
        type="button"
        onClick={onStartLiveChat}
        className="w-full p-4 rounded-3xl bg-gradient-to-tr from-[#161822] via-[#1c1f2b] to-[#241f16] border border-amber-500/50 hover:border-amber-400 flex items-center justify-between text-left group shadow-xl hover:shadow-amber-500/10 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black flex items-center justify-center font-bold shadow-lg shadow-amber-400/20 group-hover:scale-105 transition-transform">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-white group-hover:text-amber-300">
                In-App Live Chat Assistant
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                Online
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Ask how 9jacash works, Quick Code purchases &amp; withdrawals
            </p>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-500/30 text-amber-400 text-xs font-bold group-hover:bg-amber-400 group-hover:text-black transition-all">
          Chat Now →
        </div>
      </button>

      {/* Other Channels */}
      <div className="space-y-2.5">
        <a
          href="mailto:support@9jacash.ng"
          className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#16171d] border border-stone-800/80 hover:border-amber-500/40 hover:bg-[#1c1e27] transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#1f212a] text-amber-400 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-amber-300">Email Customer Care</h4>
            <p className="text-[11px] text-stone-400">support@9jacash.ng</p>
          </div>
        </a>

        <div
          onClick={() => alert('Official toll-free line: +234 (0) 700 9JACASH')}
          className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#16171d] border border-stone-800/80 hover:border-amber-500/40 hover:bg-[#1c1e27] transition-all text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-[#1f212a] text-amber-400 flex items-center justify-center">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-amber-300">Phone Support Line</h4>
            <p className="text-[11px] text-stone-400">+234 (0) 700 9JACASH (Toll-Free)</p>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="p-3.5 rounded-2xl bg-[#121317] border border-stone-800/80 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
        <p className="text-[11px] text-stone-400 leading-relaxed">
          Security reminder: 9jacash customer care and AI support will NEVER ask for your secret password, PIN, or bank OTP.
        </p>
      </div>
    </div>
  );
};
