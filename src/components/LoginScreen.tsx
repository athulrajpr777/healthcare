import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Sparkles, User, ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { signInWithGoogle } from '../firebase';

interface LoginScreenProps {
  onLogin: (userName: string, userEmail?: string, userPhoto?: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Real Firebase Google Sign-In
  const handleFirebaseGoogleLogin = async () => {
    setAuthError(null);
    setIsLoadingGoogle(true);
    try {
      const user = await signInWithGoogle();
      const displayName = user.displayName || user.email?.split('@')[0] || 'Google User';
      const userEmail = user.email || 'user@gmail.com';
      const photoURL = user.photoURL || undefined;
      onLogin(displayName, userEmail, photoURL);
    } catch (err: any) {
      console.warn('Firebase Google Auth error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in cancelled. Please click "Continue with Google" again.');
      } else if (err.code === 'auth/popup-blocked') {
        setAuthError('Pop-up window was blocked by your browser. Please allow pop-ups for this site.');
      } else {
        setAuthError(err.message || 'Failed to authenticate with Google. You can also sign in below.');
      }
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  // Optional manual email/password submit
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    let displayName = fullName.trim();
    if (!displayName && email) {
      const localPart = email.split('@')[0] || 'User';
      displayName = localPart
        .split(/[._-]/)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ');
    }
    onLogin(displayName || 'Health Member', email || 'member@glycolens.health');
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

        {/* Error Alert Message */}
        <AnimatePresence>
          {authError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 text-left"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. PRIMARY: FIREBASE GOOGLE SIGN-IN BUTTON */}
        <motion.button
          type="button"
          disabled={isLoadingGoogle}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          onClick={handleFirebaseGoogleLogin}
          className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-800 font-semibold text-xs sm:text-sm tracking-wide shadow-lg flex items-center justify-center gap-3 cursor-pointer transition-all mb-4 border border-white/60 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoadingGoogle ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-neutral-700">Connecting to Google...</span>
            </div>
          ) : (
            <>
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
              <span className="font-semibold text-neutral-900">Sign in with Google</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full ml-auto">
                Firebase Auth
              </span>
            </>
          )}
        </motion.button>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-slate-950/80 px-3 text-[11px] uppercase tracking-wider text-neutral-500 shrink-0 font-medium">
            or sign in manually
          </span>
          <div className="border-t border-white/10 w-full" />
        </div>

        {/* 2. MANUAL EMAIL/PASSWORD OPTION */}
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
                placeholder="Enter email ID"
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
            Firebase Project Active
          </span>
          <button
            type="button"
            onClick={() => onLogin('Athul Raj P. R.', 'athulrajpr777@gmail.com')}
            className="text-emerald-400 hover:text-emerald-300 font-semibold underline cursor-pointer"
          >
            Instant Demo Sign In
          </button>
        </div>
      </motion.div>
    </div>
  );
};
