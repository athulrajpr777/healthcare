import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Sparkles, ShieldCheck } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (userName: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('athulrajpr777@gmail.com');
  const [password, setPassword] = useState('••••••••••••');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin('Athul Raj P. R.');
  };

  return (
    <div className="fixed inset-0 z-50 min-h-screen w-full bg-slate-950 flex items-center justify-center p-6 overflow-hidden">
      {/* Soft bioluminescent glowing ambient auras */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-rose-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-400/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Centered Glowing Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white/[0.06] backdrop-blur-2xl border border-white/15 shadow-[0_0_60px_rgba(110,231,183,0.18)] text-center text-white"
      >
        {/* Subtle Pearl Ring */}
        <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-emerald-500/30 via-teal-400/30 to-rose-400/30 border border-white/30 mx-auto flex items-center justify-center p-0.5 mb-5 shadow-lg shadow-emerald-500/20">
          <div className="w-full h-full bg-slate-950/80 rounded-[22px] flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white mb-2 font-display">
          GlycoLens Health
        </h2>
        <p className="text-xs text-neutral-400 mb-8 max-w-xs mx-auto leading-relaxed">
          AI-powered nutrition, step burn, and continuous metabolic biomarker tracking.
        </p>

        {/* Input Form with actual input fields */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 block pl-1">
              Account Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                placeholder="Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.06] border border-white/10 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-hidden focus:border-emerald-400/80 focus:ring-1 focus:ring-emerald-400/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 block pl-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.06] border border-white/10 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-hidden focus:border-emerald-400/80 focus:ring-1 focus:ring-emerald-400/50 transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-medium text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>Login</span>
              <Sparkles className="w-4 h-4 text-emerald-200" />
            </motion.button>
          </div>
        </form>

        {/* Quick SSO Divider */}
        <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Endocrine Cloud Sync
          </span>
          <button
            type="button"
            onClick={() => onLogin('Athul Raj P. R.')}
            className="text-emerald-400 hover:text-emerald-300 font-medium underline cursor-pointer"
          >
            Instant Demo Sign In
          </button>
        </div>
      </motion.div>
    </div>
  );
};
