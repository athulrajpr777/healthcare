import React, { useState, useEffect } from 'react';
import { Footprints, Play, Pause, Flame, Route, Clock, Plus, Zap } from 'lucide-react';

interface StepCounterProps {
  steps: number;
  onUpdateSteps: (newSteps: number) => void;
  stepGoal: number;
}

export const StepCounterCard: React.FC<StepCounterProps> = ({
  steps,
  onUpdateSteps,
  stepGoal,
}) => {
  const [isWalking, setIsWalking] = useState(false);
  const [walkSeconds, setWalkSeconds] = useState(0);
  const [walkSessionSteps, setWalkSessionSteps] = useState(0);

  // 1 step = 0.04 calories burned
  const caloriesBurned = Math.round(steps * 0.04);
  const distanceKm = (steps * 0.00076).toFixed(2);
  const goalPercentage = Math.min(100, Math.round((steps / stepGoal) * 100));

  useEffect(() => {
    let interval: any = null;
    if (isWalking) {
      interval = setInterval(() => {
        setWalkSeconds((s) => s + 1);
        // Add random realistic step cadence: 2-3 steps per second during walk
        const stepInc = Math.floor(Math.random() * 2) + 2;
        setWalkSessionSteps((ws) => ws + stepInc);
        onUpdateSteps(steps + stepInc);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isWalking, steps, onUpdateSteps]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleQuickAdd = (amount: number) => {
    onUpdateSteps(steps + amount);
  };

  return (
    <div className="glass-card rounded-3xl p-6 relative overflow-hidden transition-all duration-300">
      {/* Background glow when walking is active */}
      {isWalking && (
        <div className="absolute inset-0 bg-rose-500/5 dark:bg-rose-500/10 pointer-events-none animate-pulse" />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
            isWalking 
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 animate-bounce' 
              : 'bg-rose-500/10 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400'
          }`}>
            <Footprints className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Walking & Activity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              1 step = 0.04 kcal deducted from net total
            </p>
          </div>
        </div>

        {/* Start/Stop Toggle */}
        <button
          onClick={() => setIsWalking(!isWalking)}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition-all shadow-sm active:scale-95 ${
            isWalking
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25 ring-2 ring-rose-400/40'
              : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100'
          }`}
        >
          {isWalking ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause Walk</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Start Walk</span>
            </>
          )}
        </button>
      </div>

      {/* Main Metric Spotlight */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        {/* Total Steps */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Steps Today</span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              {goalPercentage}% of goal
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {steps.toLocaleString()}
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-rose-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${goalPercentage}%` }}
            />
          </div>
        </div>

        {/* Calories Burned */}
        <div className="p-4 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/15">
          <div className="flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 mb-1">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" /> Burned
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider">Metabolic</span>
          </div>
          <div className="text-2xl font-black text-rose-500 dark:text-rose-400 tabular-nums">
            -{caloriesBurned}{' '}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">kcal</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Subtracted from daily net
          </div>
        </div>

        {/* Distance & Pace */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Route className="w-3.5 h-3.5" /> Distance
            </span>
            <span>Est.</span>
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {distanceKm}{' '}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">km</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <span>~{Math.round(steps * 0.00047)} miles</span>
            <span>·</span>
            <span>Goal: 10,000</span>
          </div>
        </div>
      </div>

      {/* Live Walk Status Bar if active */}
      {isWalking && (
        <div className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Session in progress:</span>
            <span className="font-mono font-bold tabular-nums">{formatTimer(walkSeconds)}</span>
          </div>
          <div className="text-xs text-emerald-700 dark:text-emerald-300 font-bold tabular-nums">
            +{walkSessionSteps} steps this walk (+{(walkSessionSteps * 0.04).toFixed(1)} kcal)
          </div>
        </div>
      )}

      {/* Quick Add Buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          Quick manual walk:
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuickAdd(500)}
            className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
          >
            +500 steps
          </button>
          <button
            onClick={() => handleQuickAdd(1000)}
            className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
          >
            +1,000 steps
          </button>
        </div>
      </div>
    </div>
  );
};
