import React from 'react';
import { Camera, Sun, Moon, Sparkles, User as UserIcon, LogIn, LogOut } from 'lucide-react';

interface NavbarProps {
  currentTab: 'dashboard' | 'journal' | 'analytics' | 'profile';
  onSelectTab: (tab: 'dashboard' | 'journal' | 'analytics' | 'profile') => void;
  onOpenScanner: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  userName: string;
  isLoggedIn: boolean;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenScanner,
  isDark,
  onToggleTheme,
  userName,
  isLoggedIn,
  onOpenAuth,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 group focus:outline-hidden"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-rose-400 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            </div>
          </div>
          <div>
            <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white block leading-none font-display">
              GlycoLens
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase block mt-0.5">
              Holistic Health
            </span>
          </div>
        </button>

        {/* Zone 2: 4-5 Concise Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              currentTab === 'dashboard'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Dashboard
            {currentTab === 'dashboard' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('journal')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              currentTab === 'journal'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Food Journal
            {currentTab === 'journal' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('analytics')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              currentTab === 'analytics'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Analytics & Glycemia
            {currentTab === 'analytics' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('profile')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              currentTab === 'profile'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Metabolic Aura
            {currentTab === 'profile' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Desktop Scan Plate CTA Button */}
          <button
            onClick={onOpenScanner}
            className="hidden sm:flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md shadow-emerald-600/25 transition-all active:scale-95 whitespace-nowrap shrink-0"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Scan Plate</span>
          </button>

          {/* User Profile / Auth Toggle */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-800">
              <button
                onClick={() => onSelectTab('profile')}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Profile settings"
              >
                <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center">
                  AR
                </div>
                <span className="hidden lg:inline text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {userName.split(' ')[0]}
                </span>
              </button>
              <button
                onClick={onLogout}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl transition-colors whitespace-nowrap"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
