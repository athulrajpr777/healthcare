import React, { useState } from 'react';
import { 
  Utensils, Trash2, ChevronRight, ShieldCheck, HeartPulse, 
  Sparkles, Camera, Plus, Calendar, Clock
} from 'lucide-react';
import { MealLog } from '../types';
import { sampleMeals } from '../data/seedData';

interface FoodJournalListProps {
  meals: MealLog[];
  onDeleteMeal: (id: string) => void;
  onOpenScanner: () => void;
  onLoadSampleMeals: () => void;
}

export const FoodJournalList: React.FC<FoodJournalListProps> = ({
  meals,
  onDeleteMeal,
  onOpenScanner,
  onLoadSampleMeals,
}) => {
  const [selectedMeal, setSelectedMeal] = useState<MealLog | null>(null);

  if (meals.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden transition-all">
        {/* Soft bioluminescent ambient aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-md mx-auto space-y-4">
          {/* Animated illustration container */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-rose-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10 group">
            <Utensils className="w-9 h-9 text-emerald-500 group-hover:scale-110 transition-transform duration-300" />
          </div>

          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Your Metabolic Plate is Empty
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Scan your first meal to analyze complete macronutrients, glycemic excursion curves, and nutrient density in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenScanner}
              className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>Scan Your First Meal</span>
            </button>
            <button
              onClick={onLoadSampleMeals}
              className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Load Sample Meals</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Today's Metabolic Journal
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {meals.length} meal{meals.length > 1 ? 's' : ''} logged today · Real-time biomarker analysis
          </p>
        </div>

        <button
          onClick={onOpenScanner}
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1"
        >
          <Plus className="w-4 h-4" />
          <span>Add Meal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {meals.map((meal) => (
          <div
            key={meal.id}
            onClick={() => setSelectedMeal(meal)}
            className="glass-card rounded-3xl p-4 transition-all duration-300 hover:border-emerald-500/40 hover:shadow-lg cursor-pointer group relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Card Header & Photo */}
              <div className="flex items-start gap-3.5 mb-3">
                <img
                  src={meal.imageUrl}
                  alt={meal.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 border border-slate-200/80 dark:border-slate-700 group-hover:scale-105 transition-transform"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-0.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {meal.mealType}
                    </span>
                    <span className="text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {meal.timestamp}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {meal.name}
                  </h4>

                  <div className="flex items-center gap-2 mt-1.5 text-xs">
                    <span className="font-extrabold text-slate-900 dark:text-white tabular-nums">
                      {meal.calories} kcal
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
                      {meal.protein}g protein
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="text-rose-500 dark:text-rose-400 font-medium">
                      GI {meal.glycemicIndexValue}
                    </span>
                  </div>
                </div>
              </div>

              {/* Macro Badges strip */}
              <div className="grid grid-cols-4 gap-1.5 py-2 px-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 text-center text-xs mb-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Carbs</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">{meal.carbs}g</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Fats</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">{meal.fat}g</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Fiber</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{meal.fiber}g</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Spike</span>
                  <span className="font-bold text-rose-500 dark:text-rose-400 text-[11px] truncate block">
                    {meal.glycemicLoad}
                  </span>
                </div>
              </div>

              {/* Key Highlight Preview */}
              {meal.goodHighlights.length > 0 && (
                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{meal.goodHighlights[0]}</span>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <span>View Full Bio-Decomposition</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteMeal(meal.id);
                }}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center justify-center transition-colors"
                title="Delete meal log"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal when meal is clicked */}
      {selectedMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Meal Bio-Breakdown
              </h3>
              <button
                onClick={() => setSelectedMeal(null)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"
              >
                ✕
              </button>
            </div>

            <img
              src={selectedMeal.imageUrl}
              alt={selectedMeal.name}
              className="w-full h-48 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
            />

            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{selectedMeal.timestamp}</div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">{selectedMeal.name}</h4>
              <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                {selectedMeal.calories} kcal · {selectedMeal.protein}g Protein · {selectedMeal.fiber}g Fiber
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-2">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block">
                Good Macros & Health Markers
              </span>
              <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                {selectedMeal.goodHighlights.map((gh, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{gh}</span>
                  </li>
                ))}
              </ul>
            </div>

            {selectedMeal.cautionaryMacros.length > 0 && (
              <div className="p-3 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 space-y-2">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-300 block">
                  Cautionary Macro Flags
                </span>
                <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                  {selectedMeal.cautionaryMacros.map((cm, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <HeartPulse className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span>{cm}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => setSelectedMeal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
