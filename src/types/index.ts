export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  age: number;
  heightCm: number;
  weightCurrentKg: number;
  weightGoalKg: number;
  dailyCalorieTarget: number;
  dailyStepGoal: number;
  dailyWaterGoalGlasses: number;
  metabolicAuraScore: number;
}

export interface Micronutrient {
  name: string;
  amount: string;
  dailyValuePct: number;
  status: 'optimal' | 'good' | 'caution';
}

export interface MealLog {
  id: string;
  name: string;
  timestamp: string; // ISO or readable
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  imageUrl: string;
  calories: number;
  protein: number; // grams
  carbs: number;   // grams
  fat: number;     // grams
  fiber: number;   // grams
  sugar: number;   // grams
  glycemicLoad: 'Low' | 'Moderate' | 'High';
  glycemicIndexValue: number; // e.g. 15 to 85
  glycemicSpikeEstimate: string; // e.g. "+16 mg/dL (gentle curve)"
  goodHighlights: string[];
  cautionaryMacros: string[];
  micronutrients: Micronutrient[];
  glucoseCurve: { timeMinutes: number; glucoseMgDl: number }[];
}

export interface DayHistory {
  date: string;
  dayShort: string;
  caloriesConsumed: number;
  caloriesBurnedSteps: number;
  steps: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  auraScore: number;
}

export interface Achievement {
  id: string;
  title: string;
  category: 'nutrition' | 'activity' | 'metabolic';
  description: string;
  iconName: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedDate?: string;
}
