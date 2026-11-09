import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Sparkles, User, ShieldCheck, X, Check, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (userName: string, userEmail?: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [googleStep, setGoogleStep] = useState<'picker' | 'custom'>('picker');

  // Handle standard email/password submit
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let displayName = fullName.trim();
    if (!displayName && email) {
      // derive nice display name from email (e.g. "john.doe" -> "John Doe")
      const localPart = email.split('@')[0] || 'User';
      displayName = localPart
        .split(/[._-]/)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ');
    }
    onLogin(displayName || 'Health Member', email || 'member@glycolens.health');
  };

  // Handle Google selection
  const handleSelectGoogleAccount = (name: string, accEmail: string) => {
    setIsGoogleModalOpen(false);
    onLogin(name, accEmail);
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = customGoogleEmail.trim() || 'user@gmail.com';
    let cleanName = customGoogleName.trim();
    if (!cleanName) {
      const localPart = cleanEmail.split('@')[0] || 'Google User';
      cleanName = localPart
        .split(/[._-]/)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ');
    }
    setIsGoogleModalOpen(false);
    onLogin(cleanName, cleanEmail);
  };

  return (
    <div className="fixed inset-0 z-50 min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Soft bioluminescent glowing ambient auras */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-rose-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-400/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Centered Glowing Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md p-6 sm:p-9 rounded-3xl bg-white/[0.07] backdrop-blur-2xl border border-white/15 shadow-[0_0_60px_rgba(110,231,183,0.18)] text-center text-white my-auto"
      >
        {/* Subtle Pearl Ring Icon */}
        <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-500/30 via-teal-400/30 to-rose-400/30 border border-white/30 mx-auto flex items-center justify-center p-0.5 mb-4 shadow-lg shadow-emerald-500/20">
          <div className="w-full h-full bg-slate-950/85 rounded-[14px] flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white mb-1.5 font-display">
          GlycoLens Health
        </h2>
        <p className="text-xs text-neutral-400 mb-6 max-w-xs mx-auto leading-relaxed">
          AI nutrition analysis, live step burn, and continuous metabolic biomarker tracking.
        </p>

        {/* 1. REAL GOOGLE SIGN-IN BUTTON */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          onClick={() => {
            setGoogleStep('picker');
            setIsGoogleModalOpen(true);
          }}
          className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-800 font-medium text-xs sm:text-sm tracking-wide shadow-md flex items-center justify-center gap-3 cursor-pointer transition-all mb-4 border border-white/40"
        >
          {/* Official Google 'G' Logo SVG */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span className="font-semibold text-neutral-800">Continue with Google</span>
        </motion.button>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-slate-950/80 px-3 text-[11px] uppercase tracking-wider text-neutral-500 shrink-0 font-medium">
            or sign in with email
          </span>
          <div className="border-t border-white/10 w-full" />
        </div>

        {/* 2. FLEXIBLE EMAIL/PASSWORD FORM FOR ANY USER */}
        <form onSubmit={handleEmailSubmit} className="space-y-3.5 text-left">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 block pl-1">
              Your Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="e.g. Athul Raj or your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.06] border border-white/10 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-hidden focus:border-emerald-400/80 focus:ring-1 focus:ring-emerald-400/50 transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 block pl-1">
              Account Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                placeholder="Enter any email ID (e.g. you@gmail.com)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.06] border border-white/10 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-hidden focus:border-emerald-400/80 focus:ring-1 focus:ring-emerald-400/50 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-400 block pl-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.06] border border-white/10 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-hidden focus:border-emerald-400/80 focus:ring-1 focus:ring-emerald-400/50 transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-medium text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>Login to GlycoLens</span>
              <Sparkles className="w-4 h-4 text-emerald-200" />
            </motion.button>
          </div>
        </form>

        {/* Quick Demo Instant Access */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Endocrine Cloud Active
          </span>
          <button
            type="button"
            onClick={() => onLogin('Athul Raj P. R.', 'athulrajpr777@gmail.com')}
            className="text-emerald-400 hover:text-emerald-300 font-semibold underline cursor-pointer"
          >
            Quick Demo Sign In
          </button>
        </div>
      </motion.div>

      {/* GOOGLE SIGN-IN INTERACTIVE MODAL */}
      <AnimatePresence>
        {isGoogleModalOpen && (
          <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-sm rounded-3xl bg-neutral-900 border border-neutral-700/80 p-6 text-white shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsGoogleModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Google Header */}
              <div className="flex flex-col items-center text-center mb-5">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md mb-2.5">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-white">Sign in with Google</h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  to continue to <span className="text-emerald-400 font-medium">GlycoLens Health</span>
                </p>
              </div>

              {googleStep === 'picker' ? (
                <div className="space-y-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-1">
                    Choose an account
                  </div>

                  {/* Account 1: Athul Raj */}
                  <button
                    type="button"
                    onClick={() => handleSelectGoogleAccount('Athul Raj P. R.', 'athulrajpr777@gmail.com')}
                    className="w-full p-3 rounded-2xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 hover:border-emerald-500/50 flex items-center gap-3 text-left transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      A
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-white group-hover:text-emerald-300 truncate">
                        Athul Raj P. R.
                      </div>
                      <div className="text-[11px] text-neutral-400 truncate">
                        athulrajpr777@gmail.com
                      </div>
                    </div>
                    <Check className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  {/* Account 2: Clean Alternate Account */}
                  <button
                    type="button"
                    onClick={() => handleSelectGoogleAccount('Guest Health Member', 'member@gmail.com')}
                    className="w-full p-3 rounded-2xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 hover:border-emerald-500/50 flex items-center gap-3 text-left transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      G
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-white group-hover:text-emerald-300 truncate">
                        Guest Health Member
                      </div>
                      <div className="text-[11px] text-neutral-400 truncate">
                        member@gmail.com
                      </div>
                    </div>
                    <Check className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  {/* Option 3: Enter Any Other Google Account */}
                  <button
                    type="button"
                    onClick={() => setGoogleStep('custom')}
                    className="w-full p-3 rounded-2xl bg-neutral-800/40 hover:bg-neutral-800 border border-dashed border-neutral-600 hover:border-emerald-400 flex items-center justify-between text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-medium text-neutral-300 group-hover:text-white">
                        Use another Google account...
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </button>
                </div>
              ) : (
                /* Step: Enter Custom Google Account */
                <form onSubmit={handleCustomGoogleSubmit} className="space-y-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 px-1">
                    Enter your Google details
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-semibold text-neutral-400 block mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sarah Jenkins"
                      value={customGoogleName}
                      onChange={(e) => setCustomGoogleName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-semibold text-neutral-400 block mb-1">
                      Google Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="your.email@gmail.com"
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-hidden focus:border-emerald-400"
                    />
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setGoogleStep('picker')}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-medium hover:bg-neutral-700 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold shadow-md transition-colors"
                    >
                      Sign In with Google
                    </button>
                  </div>
                </form>
              )}

              <p className="text-[10px] text-neutral-500 text-center mt-5">
                To continue, Google will share your name and email address with GlycoLens Health.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
