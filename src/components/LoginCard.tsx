import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';

interface LoginCardProps {
  onLogin: () => void;
}

export const LoginCard: React.FC<LoginCardProps> = ({ onLogin }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative z-20 w-full max-w-md mx-auto my-auto p-8 sm:p-10 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl shadow-emerald-950/10 text-center"
    >
      {/* Soft glowing ambient lighting */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-rose-200/25 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Icon */}
      <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-emerald-500/20 via-teal-400/20 to-rose-400/20 border border-white/80 mx-auto flex items-center justify-center p-0.5 mb-4 shadow-lg shadow-emerald-500/10">
        <div className="w-full h-full bg-white/70 rounded-[20px] flex items-center justify-center">
          <span className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#1C2E1E] mb-2 font-display">
        GlycoLens Health
      </h2>
      <p className="text-xs sm:text-sm text-neutral-600 mb-8 max-w-xs mx-auto leading-relaxed">
        AI-powered nutrition, step burn, and continuous metabolic biomarker tracking.
      </p>

      <div className="space-y-3.5">
        {/* Continue with Google */}
        <motion.button
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          onClick={onLogin}
          className="w-full py-3.5 px-4 rounded-2xl bg-white/80 hover:bg-white border border-white text-neutral-800 text-xs sm:text-sm font-semibold flex items-center justify-center gap-3 transition-all shadow-xs cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </motion.button>

        {/* Continue with Email */}
        <motion.button
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          onClick={onLogin}
          className="w-full py-3.5 px-4 rounded-2xl bg-white/50 hover:bg-white/70 border border-white/70 text-neutral-800 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer"
        >
          <Mail className="w-4 h-4 text-neutral-500" />
          <span>Continue with Email</span>
        </motion.button>
      </div>

      <div className="mt-8 pt-6 border-t border-white/60 flex items-center justify-center gap-4 text-[11px] text-neutral-500">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          HIPAA Ready
        </span>
        <span>·</span>
        <span className="flex items-center gap-1">
          <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
          Continuous CGM Sync
        </span>
      </div>
    </motion.div>
  );
};
