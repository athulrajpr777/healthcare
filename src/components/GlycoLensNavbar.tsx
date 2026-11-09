import React from 'react';
import { Camera, LogOut, Sparkles, User, Footprints } from 'lucide-react';

interface GlycoLensNavbarProps {
  userName: string;
  onLogout: () => void;
  onScanClick: () => void;
}

export const GlycoLensNavbar: React.FC<GlycoLensNavbarProps> = ({
  userName,
  onLogout,
  onScanClick,
}) => {
  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-white/75 border-b border-neutral-200/60 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 sm:h-18 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-teal-400/20 to-rose-400/20 border border-white/80 p-0.5 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#34d399]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-medium tracking-tight text-[#1C2E1E] font-display">
              GlycoLens
            </span>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              Health
            </span>
          </div>
        </a>

        {/* Quick Nav Links on Desktop */}
        <nav className="hidden md:flex items-center gap-7 text-xs sm:text-sm font-medium text-neutral-600">
          <a href="#hero-section" className="hover:text-black transition-colors">
            Overview
          </a>
          <a href="#lens-section" className="hover:text-black transition-colors">
            Food Scanner
          </a>
          <a href="#tracker-section" className="hover:text-black transition-colors">
            Step Tracker & Analytics
          </a>
        </nav>

        {/* Right Controls: Scan Plate & User Profile / Logout */}
        <div className="flex items-center gap-3">
          <button
            onClick={onScanClick}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Scan Plate</span>
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-neutral-200">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/70 border border-neutral-200/80 text-xs text-neutral-800 shadow-xs">
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
                A
              </div>
              <span className="font-semibold hidden sm:inline">{userName}</span>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 rounded-xl text-neutral-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
