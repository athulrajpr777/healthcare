import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  RefreshCw,
  Activity,
  Utensils,
  Footprints,
  CheckCircle2,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { MockFoodItem } from '../data/mockFoodDb';

export interface MetabolicInsightsData {
  metabolicScore: number;
  statusLabel: string;
  dailySummary: string;
  glycemicAnalysis: string;
  nextMealSuggestion: string;
  walkMinutesRecommended: number;
  walkReason: string;
  actionChecklist: string[];
}

interface AIMetabolicCoachCardProps {
  savedFoods: MockFoodItem[];
  dailySteps: number;
  onScoreUpdate?: (score: number) => void;
}

export const AIMetabolicCoachCard: React.FC<AIMetabolicCoachCardProps> = ({
  savedFoods,
  dailySteps,
  onScoreUpdate,
}) => {
  const [insights, setInsights] = useState<MetabolicInsightsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastSignatureRef = useRef<string | null>(null);

  const fetchInsights = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/metabolic-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          savedFoods: savedFoods.map((f) => ({
            name: f.name,
            calories: f.calories,
            protein: f.protein,
            carbs: f.carbs,
            fat: f.fat,
            bad: f.bad,
          })),
          dailySteps,
          localTime: new Date().toISOString(),
        }),
      });
      const payload = await res.json();
      if (!res.ok || !payload.success || !payload.data) {
        throw new Error(payload?.error || 'Failed to generate AI metabolic insights.');
      }
      setInsights(payload.data);
      if (onScoreUpdate) {
        onScoreUpdate(payload.data.metabolicScore);
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to reach AI Metabolic Coach.');
    } finally {
      setIsLoading(false);
    }
  }, [savedFoods, dailySteps, onScoreUpdate]);

  const foodsSignature = `${savedFoods.length}:${savedFoods.map((f) => f.id).join(',')}`;

  // Debounce refresh when savedFoods changes (avoids double-firing on mount + Firestore onSnapshot sync)
  useEffect(() => {
    if (lastSignatureRef.current === foodsSignature) return;
    const timer = window.setTimeout(() => {
      lastSignatureRef.current = foodsSignature;
      fetchInsights();
    }, 750);
    return () => window.clearTimeout(timer);
  }, [foodsSignature, fetchInsights]);

  return (
    <div className="w-full bg-white/55 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-950/5 relative overflow-hidden">
      {/* Bioluminescent soft background glows */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-emerald-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-neutral-200/70">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 border border-emerald-300/60 flex items-center justify-center text-emerald-700 shadow-xs">
            <Sparkles className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-medium tracking-tight text-[#1C2E1E]">
                AI Metabolic Coach & Daily Insights
              </h3>
              <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100/80 border border-emerald-200 px-2 py-0.5 rounded-full">
                Live Gemini Synthesis
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Real-time analysis of your logged meals, glycemic curve, and step calorie offset
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchInsights}
          disabled={isLoading}
          className="self-start sm:self-auto px-4 py-2 rounded-2xl bg-white/80 hover:bg-white border border-neutral-200/90 text-xs font-semibold text-neutral-700 hover:text-emerald-800 flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
          <span>{isLoading ? 'Analyzing...' : 'Refresh AI Insights'}</span>
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="relative z-10 mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchInsights}
            className="px-3 py-1 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-500 cursor-pointer shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && !insights && (
        <div className="relative z-10 py-10 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium text-neutral-600">
            Synthesizing personalized metabolic guidance from your meals & steps...
          </p>
        </div>
      )}

      {/* Insights Grid */}
      {insights && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative z-10 space-y-5"
        >
          {/* Top Row: Metabolic Aura Score + Daily & Glycemic Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Aura Score Tile */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-teal-50/70 border border-emerald-200/80 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 mb-2">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  Metabolic Aura Score
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/80 text-[10px] border border-emerald-200">
                  {insights.statusLabel}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5 my-1">
                <span className="text-4xl font-bold tracking-tight text-[#1C2E1E] tabular-nums">
                  {insights.metabolicScore}
                </span>
                <span className="text-sm text-neutral-500 font-medium">/ 100</span>
              </div>
              <div className="w-full h-2 bg-white/80 rounded-full overflow-hidden mt-2 border border-emerald-100">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-700"
                  style={{ width: `${insights.metabolicScore}%` }}
                />
              </div>
            </div>

            {/* Daily Summary & Glycemic Stability */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-white/75 border border-neutral-200/80 space-y-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                  Today&apos;s Metabolic Synthesis
                </div>
                <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed">
                  {insights.dailySummary}
                </p>
              </div>
              <div className="pt-2.5 border-t border-neutral-100 flex items-start gap-2">
                <Zap className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs text-neutral-700 leading-relaxed">
                  <span className="font-semibold text-[#1C2E1E]">Glycemic Stability: </span>
                  {insights.glycemicAnalysis}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Row: Next Meal Suggestion + Walk Prescription + Action Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Next Meal Recommendation */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                <span>Next Meal Suggestion</span>
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed">
                {insights.nextMealSuggestion}
              </p>
            </div>

            {/* Post-Meal Walk Prescription */}
            <div className="p-4 rounded-2xl bg-rose-50/75 border border-rose-200/70 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-800">
                  <Footprints className="w-3.5 h-3.5 text-rose-500" />
                  <span>Walk Prescription</span>
                </div>
                <span className="text-xs font-bold text-rose-700 bg-white/80 px-2 py-0.5 rounded-full border border-rose-200">
                  {insights.walkMinutesRecommended} min
                </span>
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed">{insights.walkReason}</p>
            </div>

            {/* Actionable Checklist */}
            <div className="p-4 rounded-2xl bg-white/75 border border-neutral-200/80 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#1C2E1E]">
                AI Action Plan
              </div>
              <ul className="space-y-1.5">
                {insights.actionChecklist.slice(0, 3).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-neutral-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
