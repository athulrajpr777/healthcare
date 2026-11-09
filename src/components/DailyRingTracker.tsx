import React from 'react';
import { Flame, Footprints, Target, Utensils } from 'lucide-react';

interface DailyRingProps {
  consumed: number;
  burnedSteps: number;
  target: number;
}

export const DailyRingTracker: React.FC<DailyRingProps> = ({
  consumed,
  burnedSteps,
  target,
}) => {
  const netCalories = Math.max(0, consumed - burnedSteps);
  const remaining = Math.max(0, target - netCalories);
  const consumedPct = Math.min(100, (consumed / target) * 100);
  const burnedPct = Math.min(100, (burnedSteps / target) * 100);
  const netPct = Math.min(100, (netCalories / target) * 100);

  // SVG circular dimensions
  const size = 200;
  const strokeWidth = 12;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  // Inner ring for steps burned
  const innerRadius = radius - 16;
  const innerCircumference = 2 * Math.PI * innerRadius;

  const consumedStrokeDashoffset = circumference - (consumedPct / 100) * circumference;
  const burnedStrokeDashoffset = innerCircumference - (burnedPct / 100) * innerCircumference;

  return (
    <div className="glass-card rounded-3xl p-6 relative overflow-hidden transition-all duration-300">
      {/* Soft bioluminescent ambient aura */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-rose-500/10 dark:bg-rose-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
        {/* Ring Graphic */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background Track - Outer */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-slate-200/80 dark:text-slate-800"
            />
            {/* Background Track - Inner */}
            <circle
              cx={center}
              cy={center}
              r={innerRadius}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={10}
              className="text-slate-200/50 dark:text-slate-800/60"
            />

            {/* Consumed Calories Arc (Mint Green) */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="url(#mintGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={consumedStrokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />

            {/* Steps Burned Arc (Blush Rose) */}
            <circle
              cx={center}
              cy={center}
              r={innerRadius}
              fill="transparent"
              stroke="url(#blushGradient)"
              strokeWidth={10}
              strokeDasharray={innerCircumference}
              strokeDashoffset={burnedStrokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />

            <defs>
              <linearGradient id="mintGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <linearGradient id="blushGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>
          </svg>

          {/* Centered Net Value */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-medium tracking-wide uppercase text-slate-500 dark:text-slate-400">
              Net Calories
            </span>
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white tabular-nums">
              {netCalories.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              of {target.toLocaleString()} kcal
            </span>
          </div>
        </div>

        {/* Legend & Breakdown stats */}
        <div className="flex-1 w-full space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Daily Calorie Budget
              </span>
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
              {target} kcal
            </span>
          </div>

          {/* Consumed */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Utensils className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Food Consumed
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Logged from scans & meals
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                +{consumed}
              </span>
              <span className="text-[10px] text-slate-400 block">kcal</span>
            </div>
          </div>

          {/* Burned through steps */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/15">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <Footprints className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Burned (Steps)
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  0.04 kcal / walking step
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-rose-500 dark:text-rose-400 tabular-nums">
                -{burnedSteps}
              </span>
              <span className="text-[10px] text-slate-400 block">kcal</span>
            </div>
          </div>

          {/* Remaining */}
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-1 px-1">
            <span>Remaining today:</span>
            <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
              {remaining > 0 ? `${remaining} kcal to go` : 'Target reached!'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
