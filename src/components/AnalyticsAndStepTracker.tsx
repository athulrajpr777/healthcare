import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Footprints, Flame, Play, Pause, Route, TrendingUp, Sparkles 
} from 'lucide-react';
import { MockFoodItem } from '../data/mockFoodDb';

export interface DayDataPoint {
  day: string;
  intake: number;
  burned: number;
}

interface AnalyticsAndStepTrackerProps {
  steps: number;
  onStepsChange: (newSteps: number) => void;
  chartData: DayDataPoint[];
  savedFoods?: MockFoodItem[];
}

export const AnalyticsAndStepTracker: React.FC<AnalyticsAndStepTrackerProps> = ({
  steps,
  onStepsChange,
  chartData,
  savedFoods = [],
}) => {
  const [isWalking, setIsWalking] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const stepsRef = React.useRef(steps);
  const onStepsChangeRef = React.useRef(onStepsChange);
  stepsRef.current = steps;
  onStepsChangeRef.current = onStepsChange;

  // Algorithm: 1 step = 0.04 calories burned
  const caloriesBurned = Math.round(steps * 0.04);
  const distanceKm = (steps * 0.00076).toFixed(2);
  const stepGoal = 10000;
  const progressPct = Math.min(100, Math.round((steps / stepGoal) * 100));

  useEffect(() => {
    if (!isWalking) return;
    const intervalId = setInterval(() => {
      setSessionSeconds((s) => s + 1);
      const tickInc = Math.floor(Math.random() * 2) + 2;
      onStepsChangeRef.current(stepsRef.current + tickInc);
    }, 800);
    return () => clearInterval(intervalId);
  }, [isWalking]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
      {/* Left Column: Step Counter & Walking Activity */}
      <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-6 md:p-8 shadow-xl shadow-emerald-950/5 relative overflow-hidden flex flex-col justify-between">
        {/* Soft glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-rose-200/20 rounded-full blur-2xl pointer-events-none" />

        <div>
          {/* Header & Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                isWalking 
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30' 
                  : 'bg-rose-50 text-rose-600 border border-rose-200/60'
              }`}>
                <Footprints className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium tracking-tight text-[#1C2E1E]">
                  Walking & Step Counter
                </h3>
                <p className="text-xs text-neutral-500">
                  1 step = 0.04 calories burned automatically
                </p>
              </div>
            </div>

            {/* "Start Walk" Toggle */}
            <button
              onClick={() => setIsWalking(!isWalking)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer ${
                isWalking
                  ? 'bg-rose-500 text-white shadow-rose-500/25 ring-2 ring-rose-300'
                  : 'bg-[#1C2E1E] hover:bg-[#28422b] text-white'
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

          {/* Active Walk Banner */}
          {isWalking && (
            <div className="mb-5 p-3 rounded-2xl bg-emerald-50/90 border border-emerald-200 flex items-center justify-between text-xs animate-pulse">
              <div className="flex items-center gap-2 text-emerald-800 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Live walk session:</span>
                <span className="font-mono font-bold tabular-nums">{formatTimer(sessionSeconds)}</span>
              </div>
              <span className="font-semibold text-emerald-700">
                Pacing: ~110 steps/min
              </span>
            </div>
          )}

          {/* Step & Calories Burned Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-white/60 border border-white/80">
              <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                <span>Steps Today</span>
                <span className="text-[10px] text-emerald-600 font-semibold">{progressPct}%</span>
              </div>
              <div className="text-3xl font-bold tracking-tight text-[#1C2E1E] tabular-nums">
                {steps.toLocaleString()}
              </div>
              <div className="w-full bg-neutral-200/70 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  className="bg-rose-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/70">
              <div className="flex items-center justify-between text-xs text-rose-700 mb-1">
                <span className="flex items-center gap-1 font-semibold">
                  <Flame className="w-3.5 h-3.5" /> Calories Burned
                </span>
              </div>
              <div className="text-3xl font-bold tracking-tight text-rose-600 tabular-nums">
                -{caloriesBurned}{' '}
                <span className="text-xs font-normal text-neutral-500">kcal</span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                Deducted from daily net calories
              </p>
            </div>
          </div>
        </div>

        {/* Footer stat */}
        <div className="pt-3 border-t border-neutral-200/70 flex items-center justify-between text-xs text-neutral-500">
          <span className="flex items-center gap-1.5">
            <Route className="w-3.5 h-3.5 text-neutral-400" />
            Estimated Distance: <strong className="text-neutral-800">{distanceKm} km</strong>
          </span>
          <span>Goal: 10,000 steps</span>
        </div>
      </div>

      {/* Right Column: Analytics AreaChart (Caloric Intake vs Burned) */}
      <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-6 md:p-8 shadow-xl shadow-emerald-950/5 relative overflow-hidden flex flex-col justify-between">
        {/* Soft glow */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-emerald-200/20 rounded-full blur-2xl pointer-events-none" />

        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-lg font-medium tracking-tight text-[#1C2E1E] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Caloric Intake vs Burned</span>
              </h3>
              <p className="text-xs text-neutral-500">
                Longitudinal metabolic tracking based on {savedFoods.length} saved meal{savedFoods.length === 1 ? '' : 's'}
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f472b6]" />
                <span className="text-neutral-600">Intake</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6ee7b7]" />
                <span className="text-neutral-600">Burned</span>
              </div>
            </div>
          </div>

          {/* Recharts AreaChart with soft pink-to-green gradient fill */}
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  {/* Soft Pink Gradient for Intake */}
                  <linearGradient id="softPinkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f472b6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f472b6" stopOpacity={0.0} />
                  </linearGradient>
                  {/* Soft Green Gradient for Burned */}
                  <linearGradient id="softGreenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6ee7b7" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#6ee7b7" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 11, fill: '#737373' }} 
                  axisLine={{ stroke: '#e5e5e5' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#737373' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    borderColor: 'rgba(229, 231, 235, 0.8)', 
                    borderRadius: 14, 
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    fontSize: 12,
                    color: '#1C2E1E'
                  }}
                  formatter={(val: any, name: any) => [
                    `${val} kcal`, 
                    name === 'intake' ? 'Caloric Intake' : 'Calories Burned (Steps)'
                  ]}
                />
                <Area 
                  type="monotone" 
                  dataKey="intake" 
                  stroke="#f472b6" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#softPinkGrad)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="burned" 
                  stroke="#10b981" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#softGreenGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-200/70 flex items-center justify-between text-xs text-neutral-500">
          <span>Continuous Glycemic Equilibrium</span>
          <span className="text-emerald-700 font-medium">Optimal Net Range</span>
        </div>
      </div>
    </div>
  );
};
