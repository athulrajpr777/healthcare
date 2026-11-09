import React from 'react';
import { LayoutDashboard, BookOpen, BarChart3, User, Camera } from 'lucide-react';

interface MobileTabBarProps {
  currentTab: 'dashboard' | 'journal' | 'analytics' | 'profile';
  onSelectTab: (tab: 'dashboard' | 'journal' | 'analytics' | 'profile') => void;
  onOpenScanner: () => void;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  currentTab,
  onSelectTab,
  onOpenScanner,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 pb-safe">
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
        {/* Dashboard */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
            currentTab === 'dashboard'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Home</span>
        </button>

        {/* Food Journal */}
        <button
          onClick={() => onSelectTab('journal')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
            currentTab === 'journal'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Journal</span>
        </button>

        {/* Central Scan Button */}
        <button
          onClick={onOpenScanner}
          className="flex flex-col items-center justify-center -mt-5"
          title="Scan Plate"
        >
          <div className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 ring-4 ring-white dark:ring-slate-950 active:scale-90 transition-all">
            <Camera className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">Scan</span>
        </button>

        {/* Analytics */}
        <button
          onClick={() => onSelectTab('analytics')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
            currentTab === 'analytics'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Analytics</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
            currentTab === 'profile'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Aura</span>
        </button>
      </div>
    </div>
  );
};
