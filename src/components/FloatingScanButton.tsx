import React from 'react';
import { Camera, Sparkles } from 'lucide-react';

interface FloatingScanButtonProps {
  onClick: () => void;
}

export const FloatingScanButton: React.FC<FloatingScanButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-20 md:bottom-8 right-6 z-40">
      {/* Pulsing ambient glow rings */}
      <div className="absolute inset-0 rounded-full bg-emerald-400 blur-lg opacity-40 animate-pulse-glow pointer-events-none" />
      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-rose-400 opacity-60 blur-xs animate-spin pointer-events-none [animation-duration:8s]" />

      <button
        onClick={onClick}
        className="relative flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-600/40 active:scale-95 transition-all group focus:outline-hidden"
      >
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
          <Camera className="w-3.5 h-3.5" />
        </div>
        <span className="tracking-wide">Scan Plate</span>
        <Sparkles className="w-3.5 h-3.5 text-emerald-200 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
};
