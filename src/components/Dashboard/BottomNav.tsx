import React from 'react';
import { ActiveTab } from '../../types/index.ts';
import { Home, CreditCard, Zap, Headphones, LayoutGrid } from 'lucide-react';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home' as ActiveTab, label: 'Home', icon: Home },
    { id: 'cards' as ActiveTab, label: 'Cards', icon: CreditCard },
    { id: 'payments' as ActiveTab, label: 'Payments', icon: Zap },
    { id: 'support' as ActiveTab, label: 'Support', icon: Headphones },
    { id: 'more' as ActiveTab, label: 'More', icon: LayoutGrid },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto bg-[#0d0e12]/95 backdrop-blur-xl border-t border-stone-800/90 px-4 py-2 pb-5 sm:pb-3 shadow-2xl">
      <div className="flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className="relative flex-1 flex flex-col items-center justify-center py-1 group focus:outline-none cursor-pointer"
            >
              {/* Active Indicator Top Line */}
              {isActive && (
                <div className="absolute -top-2 w-8 h-1 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
              )}

              {/* Icon */}
              <div
                className={`p-1 transition-transform duration-200 ${
                  isActive ? 'scale-110 text-amber-400' : 'text-stone-400 group-hover:text-stone-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
              </div>

              {/* Label */}
              <span
                className={`text-[11px] font-medium tracking-tight mt-0.5 transition-colors ${
                  isActive ? 'text-amber-400 font-semibold' : 'text-stone-400 group-hover:text-stone-200'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
