import React, { useState } from 'react';
import { 
  User, ShieldCheck, Footprints, Activity, Droplets, Award, 
  Sparkles, HeartPulse, Check, Edit3, Target, Scale, Zap
} from 'lucide-react';
import { UserProfile, Achievement } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  achievements: Achievement[];
  onUpdateUser: (updated: Partial<UserProfile>) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  achievements,
  onUpdateUser,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [weightCurrent, setWeightCurrent] = useState(user.weightCurrentKg);
  const [weightGoal, setWeightGoal] = useState(user.weightGoalKg);
  const [calorieTarget, setCalorieTarget] = useState(user.dailyCalorieTarget);
  const [stepGoal, setStepGoal] = useState(user.dailyStepGoal);

  // Dynamic Metabolic Aura Score and color classification
  const auraScore = user.metabolicAuraScore;
  const isGood = auraScore >= 80;
  const isModerate = auraScore >= 60 && auraScore < 80;
  const isNeedsImprovement = auraScore < 60;

  // Glow color classification
  const auraColorClass = isGood
    ? 'text-emerald-400 border-emerald-400/40 shadow-[0_0_45px_rgba(52,211,153,0.35)]'
    : isModerate
    ? 'text-amber-400 border-amber-400/40 shadow-[0_0_45px_rgba(251,191,36,0.35)]'
    : 'text-rose-400 border-rose-400/40 shadow-[0_0_45px_rgba(244,114,182,0.35)]';

  const auraStrokeColor = isGood ? '#34d399' : isModerate ? '#fbbf24' : '#fb7185';
  const auraLabel = isGood
    ? 'Peak Metabolic Flexibility'
    : isModerate
    ? 'Balanced Glycemic Tone'
    : 'Needs Metabolic Reset';

  const handleSaveSettings = () => {
    onUpdateUser({
      weightCurrentKg: weightCurrent,
      weightGoalKg: weightGoal,
      dailyCalorieTarget: calorieTarget,
      dailyStepGoal: stepGoal,
    });
    setIsEditing(false);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'Footprints': return <Footprints className="w-5 h-5" />;
      case 'Activity': return <Activity className="w-5 h-5" />;
      case 'Droplets': return <Droplets className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      default: return <Award className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header & Bio-Card */}
      <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
        {/* Soft bioluminescent ambient aura */}
        <div className="absolute top-0 right-0 w-56 h-56 bg-emerald-500/10 dark:bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-emerald-400/40 shadow-lg shadow-emerald-500/20">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shadow-md">
                <Zap className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {user.name}
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                  Pro Member
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {user.email}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-slate-600 dark:text-slate-300">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Age</span>
                  <span className="font-bold text-slate-900 dark:text-white">{user.age} yrs</span>
                </div>
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Current Weight</span>
                  <span className="font-bold text-slate-900 dark:text-white">{user.weightCurrentKg} kg</span>
                </div>
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Target Goal</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{user.weightGoalKg} kg</span>
                </div>
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Metabolic Target</span>
                  <span className="font-bold text-slate-900 dark:text-white">{user.dailyCalorieTarget} kcal</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Adjust Targets'}</span>
          </button>
        </div>

        {/* Quick Edit Targets Drawer */}
        {isEditing && (
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-4 animate-fade-in">
            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                Current Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={weightCurrent}
                onChange={(e) => setWeightCurrent(parseFloat(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                Weight Goal (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={weightGoal}
                onChange={(e) => setWeightGoal(parseFloat(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                Daily Calorie Target (kcal)
              </label>
              <input
                type="number"
                value={calorieTarget}
                onChange={(e) => setCalorieTarget(parseInt(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleSaveSettings}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <Check className="w-4 h-4" />
                <span>Save New Goals</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Fascinating & Gamified: "Metabolic Aura Score" Spotlight */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Glowing Circular Graphical Dial */}
          <div className="flex flex-col items-center text-center">
            <div className="relative flex items-center justify-center mb-4">
              {/* Outer Bioluminescent Glow Ring */}
              <div className={`w-44 h-44 rounded-full border-4 flex items-center justify-center transition-all duration-700 ${auraColorClass}`}>
                <div className="flex flex-col items-center justify-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Aura Score
                  </span>
                  <span className="text-5xl font-black tracking-tight tabular-nums" style={{ color: auraStrokeColor }}>
                    {auraScore}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">/ 100</span>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {auraLabel}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1">
              Synthesized from glycemic stability, walking energy expenditure, and high-protein density.
            </p>
          </div>

          {/* Right: Score Breakdown Pillars */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Endocrine & Biomarker Index
              </span>
              <span className="text-emerald-500 font-bold">Top 8% in Cohort</span>
            </div>

            {/* Protein & Fiber Quality */}
            <div className="p-3 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Protein & Satiety Factor
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">94 / 100</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                135g average daily intake preserves lean body mass
              </div>
            </div>

            {/* Walking & GLUT4 Clearance */}
            <div className="p-3 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/15">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Footprints className="w-3.5 h-3.5 text-rose-500" />
                  Post-Meal Walking Offset
                </span>
                <span className="font-bold text-rose-500 dark:text-rose-400">88 / 100</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Consistent 7,000–12,000 steps blunts peak glucose spikes
              </div>
            </div>

            {/* Glycemic Curve Stability */}
            <div className="p-3 rounded-2xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/15">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-cyan-500" />
                  Glycemic Stability Curve
                </span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400">92 / 100</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Minimal sharp glycemic spikes over last 48 hours
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gamified Achievements / Badges Grid */}
      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Metabolic Badges & Milestones</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gamified health milestones unlocked through real habits
            </p>
          </div>

          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            {achievements.filter(a => a.unlocked).length} of {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                ach.unlocked
                  ? 'bg-slate-50 dark:bg-slate-800/40 border-emerald-500/30 shadow-xs'
                  : 'bg-slate-100/50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                  ach.unlocked
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 ring-2 ring-emerald-500/30'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                }`}>
                  {getIcon(ach.iconName)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {ach.title}
                    </h4>
                    {ach.unlocked && (
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        Unlocked
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                    {ach.description}
                  </p>

                  <div className="mt-2.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span>Progress</span>
                      <span className="tabular-nums font-semibold text-slate-600 dark:text-slate-300">
                        {ach.progress} / {ach.maxProgress}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          ach.unlocked ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                        style={{ width: `${Math.min(100, (ach.progress / ach.maxProgress) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
