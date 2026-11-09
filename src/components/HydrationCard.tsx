import React from 'react';
import { Droplet, Plus, Minus, Sparkles } from 'lucide-react';

interface HydrationProps {
  glasses: number;
  goal: number;
  onUpdate: (glasses: number) => void;
}

export const HydrationCard: React.FC<HydrationProps> = ({
  glasses,
  goal,
  onUpdate,
}) => {
  const liters = (glasses * 0.25).toFixed(2);
  const goalLiters = (goal * 0.25).toFixed(1);
  const percentage = Math.min(100, Math.round((glasses / goal) * 100));

  const addGlass = () => {
    onUpdate(glasses + 1);
  };

  const removeGlass = () => {
    if (glasses > 0) {
      onUpdate(glasses - 1);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 relative overflow-hidden transition-all duration-300">
      {/* Bioluminescent blue-cyan ambient glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 dark:bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400 flex items-center justify-center">
            <Droplet className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Hydration Tracker
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Blunts glucose spikes & aids metabolic enzyme flow
            </p>
          </div>
        </div>

        {/* Counter Action Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl">
          <button
            onClick={removeGlass}
            disabled={glasses <= 0}
            className="w-8 h-8 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors active:scale-95 shadow-xs"
            title="Remove glass"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center text-xs font-bold text-slate-900 dark:text-white tabular-nums">
            {glasses}
          </span>
          <button
            onClick={addGlass}
            className="w-8 h-8 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center transition-colors active:scale-95 shadow-sm shadow-cyan-500/20"
            title="Add glass of water"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visual Glasses Display */}
      <div className="grid grid-cols-8 gap-1.5 my-4">
        {Array.from({ length: goal }).map((_, index) => {
          const isFilled = index < glasses;
          return (
            <button
              key={index}
              onClick={() => onUpdate(index + 1)}
              className={`h-11 rounded-xl flex flex-col items-center justify-center transition-all duration-300 relative ${
                isFilled
                  ? 'bg-cyan-500/15 border border-cyan-400/40 text-cyan-500 dark:text-cyan-400 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-slate-300 dark:text-slate-600 hover:border-cyan-400/30'
              }`}
              title={`Glass ${index + 1}`}
            >
              <Droplet
                className={`w-4 h-4 transition-transform duration-300 ${
                  isFilled ? 'scale-110 fill-current' : 'scale-90'
                }`}
              />
              <span className="text-[9px] font-mono mt-0.5 tabular-nums">
                {index + 1}
              </span>
            </button>
          );
        })}
      </div>

      {/* Progress & Milestone */}
      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
            {liters} L
          </span>
          <span>of {goalLiters} L target</span>
        </div>
        <div className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 font-medium">
          {percentage >= 100 ? (
            <span className="flex items-center gap-1 text-emerald-500">
              <Sparkles className="w-3.5 h-3.5" /> Optimal Cellular Hydration
            </span>
          ) : (
            <span>{percentage}% reached</span>
          )}
        </div>
      </div>
    </div>
  );
};
