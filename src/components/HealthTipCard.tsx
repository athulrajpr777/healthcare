import React, { useState } from 'react';
import { Lightbulb, RefreshCw, Sparkles, ArrowRight } from 'lucide-react';
import { healthTipsList } from '../data/seedData';

export const HealthTipCard: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const currentTip = healthTipsList[currentIndex];

  const handleNextTip = () => {
    setIsRotating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % healthTipsList.length);
      setIsRotating(false);
    }, 250);
  };

  return (
    <div className="glass-card rounded-3xl p-6 relative overflow-hidden transition-all duration-300">
      {/* Soft emerald ambient glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold tracking-wide uppercase text-emerald-600 dark:text-emerald-400">
            Daily AI Metabolic Insight
          </span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {currentTip.category}
          </span>
        </div>

        <button
          onClick={handleNextTip}
          className="text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium transition-colors active:scale-95"
          title="Next Tip"
        >
          <RefreshCw className={`w-3 h-3 ${isRotating ? 'animate-spin' : ''}`} />
          <span>New Tip</span>
        </button>
      </div>

      <div className={`transition-opacity duration-200 ${isRotating ? 'opacity-30' : 'opacity-100'}`}>
        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug">
          {currentTip.title}
        </h4>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {currentTip.content}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
        <span>Curated via GlycoLens Endocrine Engine</span>
        <button
          onClick={handleNextTip}
          className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium"
        >
          <span>Explore next insight</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
