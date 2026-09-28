import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Eye, EyeOff } from 'lucide-react';

export const BalanceCard: React.FC = () => {
  const { user, isBalanceHidden, toggleBalanceVisibility, formatNaira } = useAuth();

  const balance = user?.balance ?? 0;
  const availableBalance = user?.availableBalance ?? 0;

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-r from-[#121316] via-[#16171d] to-[#1a1715] border border-amber-500/30 p-5 sm:p-6 shadow-xl text-white">
      {/* Golden wavy ribbon backdrop matching screenshot */}
      <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
        <svg
          viewBox="0 0 400 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute right-0 top-0 h-full w-full object-cover"
          preserveAspectRatio="none"
        >
          <path
            d="M200,0 C260,80 320,120 400,160 L400,0 Z"
            fill="url(#goldGradient1)"
            opacity="0.35"
          />
          <path
            d="M170,0 C240,60 300,100 400,120 L400,0 Z"
            fill="url(#goldGradient2)"
            opacity="0.45"
          />
          <path
            d="M230,0 C290,90 350,140 400,190"
            stroke="url(#goldStroke)"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <path
            d="M210,0 C270,70 330,110 400,140"
            stroke="url(#goldStroke)"
            strokeWidth="1"
            opacity="0.4"
          />
          <defs>
            <linearGradient id="goldGradient1" x1="200" y1="0" x2="400" y2="160" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="0.5" stopColor="#d97706" stopOpacity="0.4" />
              <stop offset="1" stopColor="#78350f" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="goldGradient2" x1="170" y1="0" x2="400" y2="120" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fde047" stopOpacity="0.7" />
              <stop offset="0.6" stopColor="#b45309" stopOpacity="0.3" />
              <stop offset="1" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="goldStroke" x1="200" y1="0" x2="400" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fef08a" />
              <stop offset="0.5" stopColor="#f59e0b" />
              <stop offset="1" stopColor="#78350f" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 flex items-center justify-between">
        {/* Left: Balances */}
        <div className="space-y-1">
          {/* Total Balance label with Eye icon */}
          <div className="flex items-center gap-2 text-stone-400">
            <span className="text-xs sm:text-sm font-medium tracking-wide">Total Balance</span>
            <button
              type="button"
              onClick={toggleBalanceVisibility}
              className="p-1 rounded-md text-stone-400 hover:text-white transition-colors focus:outline-none"
              title={isBalanceHidden ? 'Show balance' : 'Hide balance'}
            >
              {isBalanceHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Big Amount in Naira */}
          <div className="py-1">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {isBalanceHidden ? '₦ •••••••' : formatNaira(balance)}
            </h2>
          </div>

          {/* Available Balance */}
          <div className="pt-0.5">
            <p className="text-xs sm:text-[13px] text-stone-400 font-medium">
              Available Balance:{' '}
              <span className="text-stone-300 font-semibold">
                {isBalanceHidden ? '₦ ••••' : formatNaira(availableBalance)}
              </span>
            </p>
          </div>
        </div>

        {/* Right: Golden Bank Temple Pillar Emblem */}
        <div className="flex flex-col items-center justify-center pl-4 select-none">
          {/* Bank Pillar Building */}
          <div className="w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center">
            <svg
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-[0_4px_12px_rgba(245,158,11,0.35)]"
            >
              {/* Pediment / Roof */}
              <polygon
                points="32,8 10,22 54,22"
                fill="#f59e0b"
              />
              {/* Roof Architrave */}
              <rect x="8" y="22" width="48" height="4" rx="1" fill="#fbbf24" />
              
              {/* Pillars (4 classical columns) */}
              {/* Pillar 1 */}
              <rect x="13" y="27" width="5" height="20" rx="1" fill="#f59e0b" />
              {/* Pillar 2 */}
              <rect x="23" y="27" width="5" height="20" rx="1" fill="#fbbf24" />
              {/* Pillar 3 */}
              <rect x="36" y="27" width="5" height="20" rx="1" fill="#fbbf24" />
              {/* Pillar 4 */}
              <rect x="46" y="27" width="5" height="20" rx="1" fill="#f59e0b" />

              {/* Base / Steps */}
              <rect x="10" y="48" width="44" height="3" rx="1" fill="#d97706" />
              <rect x="6" y="52" width="52" height="4" rx="1" fill="#b45309" />
            </svg>
          </div>

          {/* Subtext underneath pillar */}
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-amber-400/90 whitespace-nowrap mt-1">
            Safe • Secure • Always
          </span>
        </div>
      </div>
    </div>
  );
};
