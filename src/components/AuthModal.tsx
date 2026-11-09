import React, { useState } from 'react';
import { X, Sparkles, Mail, Lock, Check, ShieldCheck, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';
import { initialUser } from '../data/seedData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'email'>('login');
  const [email, setEmail] = useState('athulrajpr777@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [fullName, setFullName] = useState('Athul Raj P. R.');

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    // Seamless simulated Google SSO login for Athul Raj P. R.
    onLoginSuccess({
      ...initialUser,
      name: 'Athul Raj P. R.',
      email: 'athulrajpr777@gmail.com',
    });
    onClose();
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({
      ...initialUser,
      name: fullName || 'Athul Raj P. R.',
      email: email || 'athulrajpr777@gmail.com',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 animate-fade-in">
        {/* Soft bioluminescent ambient aura */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-rose-500/10 dark:bg-rose-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Logo & Lockup */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 mx-auto p-0.5 mb-3 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[14px] flex items-center justify-center">
              <span className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
            </div>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Welcome to GlycoLens
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Biomarker nutrition, step burn & continuous metabolic health
          </p>
        </div>

        {authMode === 'login' ? (
          <div className="space-y-3.5">
            {/* Continue with Google */}
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-3 transition-all shadow-xs active:scale-[0.99]"
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
            </button>

            {/* Continue with Email Trigger */}
            <button
              onClick={() => setAuthMode('email')}
              className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2.5 transition-colors"
            >
              <Mail className="w-4 h-4 text-slate-500" />
              <span>Continue with Email</span>
            </button>

            {/* Instant Demo Login Button */}
            <div className="pt-2">
              <button
                onClick={handleGoogleLogin}
                className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 active:scale-[0.99] transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Instant Sign In as Athul Raj P. R.</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="w-1/3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 font-semibold"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
              >
                Enter Health Hub
              </button>
            </div>
          </form>
        )}

        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-[11px] text-slate-400">
          <span>Encrypted Endocrine & Biomarker Data Storage</span>
        </div>
      </div>
    </div>
  );
};
