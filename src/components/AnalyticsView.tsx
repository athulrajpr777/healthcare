import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import { 
  Flame, Footprints, Utensils, TrendingUp, PieChart as PieIcon, 
  Search, ShieldCheck, HeartPulse, Filter, ArrowUpRight
} from 'lucide-react';
import { DayHistory, MealLog } from '../types';

interface AnalyticsViewProps {
  history: DayHistory[];
  meals: MealLog[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ history, meals }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [macroFilter, setMacroFilter] = useState<'all' | 'high-protein' | 'low-glycemic'>('all');

  // Compute total aggregates for the 7-day period
  const totalBurnedSteps = history.reduce((acc, curr) => acc + curr.caloriesBurnedSteps, 0);
  const totalCaloriesConsumed = history.reduce((acc, curr) => acc + curr.caloriesConsumed, 0);
  const totalSteps = history.reduce((acc, curr) => acc + curr.steps, 0);
  const avgAura = Math.round(history.reduce((acc, curr) => acc + curr.auraScore, 0) / history.length);

  // Macro distribution for the pie chart
  const totalProtein = history.reduce((acc, curr) => acc + curr.proteinGrams, 0);
  const totalCarbs = history.reduce((acc, curr) => acc + curr.carbsGrams, 0);
  const totalFat = history.reduce((acc, curr) => acc + curr.fatGrams, 0);
  const totalFiber = history.reduce((acc, curr) => acc + curr.fiberGrams, 0);

  const macroPieData = [
    { name: 'Protein (Protective)', value: totalProtein, color: '#34d399' },
    { name: 'Dietary Fiber (Prebiotic)', value: totalFiber, color: '#10b981' },
    { name: 'Healthy Lipids & Fats', value: totalFat, color: '#38bdf8' },
    { name: 'Complex Carbohydrates', value: Math.max(0, totalCarbs - totalFiber), color: '#fb7185' },
  ];

  // Filtered meals list
  const filteredMeals = meals.filter((meal) => {
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          meal.mealType.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (macroFilter === 'high-protein') return meal.protein >= 25;
    if (macroFilter === 'low-glycemic') return meal.glycemicLoad === 'Low';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 4-KPI Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="glass-card rounded-3xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>7-Day Caloric Intake</span>
            <Utensils className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {totalCaloriesConsumed.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <span>Avg {Math.round(totalCaloriesConsumed / 7)} kcal/day</span>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Burned Via Walking</span>
            <Footprints className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-500 dark:text-rose-400 tabular-nums">
            -{totalBurnedSteps.toLocaleString()} <span className="text-xs font-normal text-slate-500">kcal</span>
          </div>
          <div className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
            <span>{totalSteps.toLocaleString()} steps logged</span>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Avg Metabolic Aura</span>
            <TrendingUp className="w-3.5 h-3.5 text-cyan-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-500 tabular-nums">
            {avgAura} <span className="text-xs font-normal text-slate-400">/ 100</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            High cellular resilience
          </div>
        </div>

        <div className="glass-card rounded-3xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Daily Walking Cadence</span>
            <Flame className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {Math.round(totalSteps / 7).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            steps / day average
          </div>
        </div>
      </div>

      {/* Chart 1: Caloric Intake vs. Calories Burned via Steps (Area Chart) */}
      <div className="glass-card rounded-3xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Caloric Intake vs. Walking Burn</span>
              <span className="text-xs font-normal text-slate-400">7-Day Trajectory</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tracking net caloric balance and postprandial activity offset
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-500/80" />
              <span className="text-slate-600 dark:text-slate-300">Intake (kcal)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-rose-500" />
              <span className="text-slate-600 dark:text-slate-300">Walk Burn (kcal)</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="intakeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="burnedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb7185" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#fb7185" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="dayShort" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0f172a', 
                  borderColor: '#334155', 
                  borderRadius: 14, 
                  color: '#fff', 
                  fontSize: 12 
                }}
                formatter={(val: any, name: any) => [
                  `${val} kcal`, 
                  name === 'caloriesConsumed' ? 'Calories Consumed' : 'Calories Burned (Steps)'
                ]}
              />
              <Area 
                type="monotone" 
                dataKey="caloriesConsumed" 
                stroke="#34d399" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#intakeGrad)" 
              />
              <Area 
                type="monotone" 
                dataKey="caloriesBurnedSteps" 
                stroke="#fb7185" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#burnedGrad)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Macro Breakdown & Nutritional Ratio (Pie / Donut Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card rounded-3xl p-6 lg:col-span-1">
          <div className="mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-500" />
              <span>Macro Balance Ratio</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Protective vs. glycemic macronutrients
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {macroPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#334155', 
                    borderRadius: 12, 
                    color: '#fff', 
                    fontSize: 11 
                  }}
                  formatter={(value: any) => [`${value}g`, 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="space-y-2 mt-2">
            {macroPieData.map((macro, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: macro.color }} />
                  <span className="text-slate-600 dark:text-slate-300">{macro.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">{macro.value}g</span>
              </div>
            ))}
          </div>
        </div>

        {/* History List: A scrollable log of all saved food photos with micro-stats */}
        <div className="glass-card rounded-3xl p-6 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Logged Food Photos & Micro-Stats
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Comprehensive audit trail of optical meal scans
                </p>
              </div>

              {/* Search & Filter */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search meal or type..."
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 w-36 sm:w-44"
                  />
                </div>

                <select
                  value={macroFilter}
                  onChange={(e: any) => setMacroFilter(e.target.value)}
                  className="py-1.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 border-none focus:outline-hidden"
                >
                  <option value="all">All Macros</option>
                  <option value="high-protein">High Protein (25g+)</option>
                  <option value="low-glycemic">Low Glycemic</option>
                </select>
              </div>
            </div>

            {/* Scrollable List */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {filteredMeals.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-400">
                  No food logs matched your filter criteria.
                </div>
              ) : (
                filteredMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 transition-colors hover:bg-slate-100/60 dark:hover:bg-slate-800/80"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={meal.imageUrl}
                        alt={meal.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {meal.name}
                        </h4>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                          <span>{meal.mealType}</span>
                          <span>·</span>
                          <span>{meal.timestamp}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white tabular-nums">
                        {meal.calories} kcal
                      </div>
                      <div className="text-[11px] flex items-center gap-1.5 justify-end mt-0.5">
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{meal.protein}g P</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-emerald-600 dark:text-emerald-400">{meal.fiber}g F</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-rose-500 font-medium">GI {meal.glycemicIndexValue}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Continuous Glucose Prediction Accuracy: 94.2%</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active CGM Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
