import { UserProfile, MealLog, DayHistory, Achievement } from '../types';

export const initialUser: UserProfile = {
  id: 'user_athul_01',
  name: 'Athul Raj P. R.',
  email: 'athulrajpr777@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  age: 28,
  heightCm: 178,
  weightCurrentKg: 75.4,
  weightGoalKg: 72.0,
  dailyCalorieTarget: 2150,
  dailyStepGoal: 10000,
  dailyWaterGoalGlasses: 8,
  metabolicAuraScore: 89,
};

export const sampleMeals: MealLog[] = [
  {
    id: 'meal_1',
    name: 'Wild Salmon & Quinoa Bowl',
    timestamp: 'Today · 12:45 PM',
    mealType: 'Lunch',
    imageUrl: '/src/assets/images/salmon_grain_bowl_1794213151942.jpg',
    calories: 540,
    protein: 42,
    carbs: 38,
    fat: 22,
    fiber: 11,
    sugar: 3,
    glycemicLoad: 'Low',
    glycemicIndexValue: 24,
    glycemicSpikeEstimate: '+14 mg/dL (gentle wave)',
    goodHighlights: [
      'High Bioavailable Protein (42g)',
      'Rich in Omega-3 EPA/DHA fatty acids',
      'High Dietary Soluble Fiber (11g)',
      'Rich in Vitamin D & Selenium'
    ],
    cautionaryMacros: [
      'Moderate Healthy Fats (22g) - monitor if on strict deficit'
    ],
    micronutrients: [
      { name: 'Omega-3', amount: '2.4g', dailyValuePct: 160, status: 'optimal' },
      { name: 'Vitamin D', amount: '820 IU', dailyValuePct: 105, status: 'optimal' },
      { name: 'Magnesium', amount: '95 mg', dailyValuePct: 24, status: 'good' },
      { name: 'Zinc', amount: '2.8 mg', dailyValuePct: 25, status: 'good' }
    ],
    glucoseCurve: [
      { timeMinutes: 0, glucoseMgDl: 92 },
      { timeMinutes: 15, glucoseMgDl: 96 },
      { timeMinutes: 30, glucoseMgDl: 104 },
      { timeMinutes: 45, glucoseMgDl: 106 },
      { timeMinutes: 60, glucoseMgDl: 102 },
      { timeMinutes: 90, glucoseMgDl: 94 },
      { timeMinutes: 120, glucoseMgDl: 91 }
    ]
  },
  {
    id: 'meal_2',
    name: 'Berry Chia Greek Yogurt Bowl',
    timestamp: 'Today · 8:15 AM',
    mealType: 'Breakfast',
    imageUrl: '/src/assets/images/berry_yogurt_parfait_1794213153370.jpg',
    calories: 320,
    protein: 28,
    carbs: 26,
    fat: 7,
    fiber: 9,
    sugar: 12,
    glycemicLoad: 'Low',
    glycemicIndexValue: 28,
    glycemicSpikeEstimate: '+16 mg/dL (blunted by casein protein)',
    goodHighlights: [
      'Slow-release Micellar Casein Protein (28g)',
      'Potent Polyphenols & Anthocyanins',
      'Mucilage Prebiotic Fiber (9g)',
      'Live Active Probiotics'
    ],
    cautionaryMacros: [
      '12g Natural Fructose from fresh berries'
    ],
    micronutrients: [
      { name: 'Calcium', amount: '340 mg', dailyValuePct: 34, status: 'optimal' },
      { name: 'Vitamin C', amount: '24 mg', dailyValuePct: 32, status: 'good' },
      { name: 'Potassium', amount: '410 mg', dailyValuePct: 12, status: 'good' }
    ],
    glucoseCurve: [
      { timeMinutes: 0, glucoseMgDl: 88 },
      { timeMinutes: 15, glucoseMgDl: 95 },
      { timeMinutes: 30, glucoseMgDl: 102 },
      { timeMinutes: 45, glucoseMgDl: 104 },
      { timeMinutes: 60, glucoseMgDl: 98 },
      { timeMinutes: 90, glucoseMgDl: 90 },
      { timeMinutes: 120, glucoseMgDl: 87 }
    ]
  }
];

export const presetScanFoods = [
  {
    name: 'Avocado & Poached Egg Toast',
    mealType: 'Breakfast' as const,
    imageUrl: '/src/assets/images/avocado_poached_egg_1794213153783.jpg',
    calories: 385,
    protein: 18,
    carbs: 32,
    fat: 21,
    fiber: 9,
    sugar: 2,
    glycemicLoad: 'Low' as const,
    glycemicIndexValue: 32,
    glycemicSpikeEstimate: '+19 mg/dL (cushioned by yolk fat & fiber)',
    goodHighlights: [
      'Choline from organic egg yolk',
      'Monounsaturated oleic fats from ripe avocado',
      'Slow-fermented sourdough lower GI'
    ],
    cautionaryMacros: [
      'Sodium ~420mg (seasoning salt)'
    ],
    micronutrients: [
      { name: 'Choline', amount: '165 mg', dailyValuePct: 30, status: 'optimal' as const },
      { name: 'Folate', amount: '90 mcg', dailyValuePct: 23, status: 'good' as const },
      { name: 'Lutein', amount: '280 mcg', dailyValuePct: 40, status: 'optimal' as const }
    ],
    glucoseCurve: [
      { timeMinutes: 0, glucoseMgDl: 90 },
      { timeMinutes: 15, glucoseMgDl: 98 },
      { timeMinutes: 30, glucoseMgDl: 108 },
      { timeMinutes: 45, glucoseMgDl: 109 },
      { timeMinutes: 60, glucoseMgDl: 101 },
      { timeMinutes: 90, glucoseMgDl: 93 },
      { timeMinutes: 120, glucoseMgDl: 89 }
    ]
  },
  {
    name: 'Mediterranean Chicken Herb Salad',
    mealType: 'Dinner' as const,
    imageUrl: '/src/assets/images/mediterranean_chicken_salad_1794213153567.jpg',
    calories: 450,
    protein: 46,
    carbs: 14,
    fat: 22,
    fiber: 7,
    sugar: 4,
    glycemicLoad: 'Low' as const,
    glycemicIndexValue: 18,
    glycemicSpikeEstimate: '+11 mg/dL (flat metabolic line)',
    goodHighlights: [
      'Lean Poultry Protein (46g)',
      'Polyphenol-rich extra virgin olive oil',
      'High leafy greens micronutrient density'
    ],
    cautionaryMacros: [
      'Sodium ~580mg from Kalamata olives and sheep feta'
    ],
    micronutrients: [
      { name: 'Iron', amount: '3.4 mg', dailyValuePct: 28, status: 'good' as const },
      { name: 'Vitamin K', amount: '180 mcg', dailyValuePct: 150, status: 'optimal' as const },
      { name: 'Niacin (B3)', amount: '12 mg', dailyValuePct: 75, status: 'optimal' as const }
    ],
    glucoseCurve: [
      { timeMinutes: 0, glucoseMgDl: 94 },
      { timeMinutes: 15, glucoseMgDl: 97 },
      { timeMinutes: 30, glucoseMgDl: 103 },
      { timeMinutes: 45, glucoseMgDl: 105 },
      { timeMinutes: 60, glucoseMgDl: 100 },
      { timeMinutes: 90, glucoseMgDl: 95 },
      { timeMinutes: 120, glucoseMgDl: 93 }
    ]
  }
];

export const sevenDayHistory: DayHistory[] = [
  {
    date: '2026-11-03',
    dayShort: 'Mon',
    caloriesConsumed: 2050,
    caloriesBurnedSteps: 440,
    steps: 11000,
    proteinGrams: 142,
    carbsGrams: 195,
    fatGrams: 64,
    fiberGrams: 34,
    auraScore: 91,
  },
  {
    date: '2026-11-04',
    dayShort: 'Tue',
    caloriesConsumed: 2180,
    caloriesBurnedSteps: 380,
    steps: 9500,
    proteinGrams: 135,
    carbsGrams: 210,
    fatGrams: 70,
    fiberGrams: 30,
    auraScore: 86,
  },
  {
    date: '2026-11-05',
    dayShort: 'Wed',
    caloriesConsumed: 1940,
    caloriesBurnedSteps: 512,
    steps: 12800,
    proteinGrams: 150,
    carbsGrams: 175,
    fatGrams: 58,
    fiberGrams: 38,
    auraScore: 95,
  },
  {
    date: '2026-11-06',
    dayShort: 'Thu',
    caloriesConsumed: 2280,
    caloriesBurnedSteps: 310,
    steps: 7750,
    proteinGrams: 120,
    carbsGrams: 245,
    fatGrams: 78,
    fiberGrams: 24,
    auraScore: 78,
  },
  {
    date: '2026-11-07',
    dayShort: 'Fri',
    caloriesConsumed: 2120,
    caloriesBurnedSteps: 420,
    steps: 10500,
    proteinGrams: 138,
    carbsGrams: 200,
    fatGrams: 68,
    fiberGrams: 32,
    auraScore: 88,
  },
  {
    date: '2026-11-08',
    dayShort: 'Sat',
    caloriesConsumed: 2310,
    caloriesBurnedSteps: 580,
    steps: 14500,
    proteinGrams: 145,
    carbsGrams: 220,
    fatGrams: 76,
    fiberGrams: 35,
    auraScore: 92,
  },
  {
    date: '2026-11-09',
    dayShort: 'Sun (Today)',
    caloriesConsumed: 860, // Current breakfast + lunch
    caloriesBurnedSteps: 288, // 7,200 steps so far
    steps: 7200,
    proteinGrams: 70,
    carbsGrams: 64,
    fatGrams: 29,
    fiberGrams: 20,
    auraScore: 89,
  }
];

export const healthTipsList = [
  {
    title: 'Postprandial Walking Blunts Blood Glucose Excursions',
    content: 'Taking a 10 to 15-minute gentle walk immediately after lunch or dinner activates GLUT4 glucose transporters in skeletal muscle independent of insulin, lowering peak glucose spikes by up to 28%.',
    category: 'Activity Timing'
  },
  {
    title: 'Food Sequencing: Fiber & Protein First',
    content: 'Eating your dietary fiber (greens, vegetables) and protein before starchy carbohydrates coats the intestinal lining and stimulates GLP-1, smoothing the metabolic curve and prolonging satiety.',
    category: 'Meal Sequencing'
  },
  {
    title: 'Hydration Cushion for Osmotic Balance',
    content: 'Drinking 300ml of mineral-rich water 15 minutes prior to meal ingestion enhances digestive enzyme distribution and prevents intracellular dehydration during gastric acid production.',
    category: 'Hydration'
  },
  {
    title: 'Omega-3 Fatty Acids & Cell Membrane Fluidity',
    content: 'EPA and DHA from wild salmon increase cellular insulin receptor sensitivity, making it easier for your muscle cells to clear post-meal glucose without excessive pancreatic strain.',
    category: 'Nutrient Synergy'
  }
];

export const userAchievements: Achievement[] = [
  {
    id: 'ach_1',
    title: 'Protein Master',
    category: 'nutrition',
    description: 'Surpassed 130g of high-quality dietary protein for 5 consecutive days',
    iconName: 'ShieldCheck',
    unlocked: true,
    progress: 5,
    maxProgress: 5,
    unlockedDate: 'Nov 07, 2026'
  },
  {
    id: 'ach_2',
    title: '10k Steps Club',
    category: 'activity',
    description: 'Logged over 10,000 steps in a single day through brisk outdoor walking',
    iconName: 'Footprints',
    unlocked: true,
    progress: 10000,
    maxProgress: 10000,
    unlockedDate: 'Nov 08, 2026'
  },
  {
    id: 'ach_3',
    title: 'Glycemic Stabilizer',
    category: 'metabolic',
    description: 'Kept daily blood sugar excursion peaks under +25 mg/dL across all meals',
    iconName: 'Activity',
    unlocked: true,
    progress: 3,
    maxProgress: 3,
    unlockedDate: 'Nov 06, 2026'
  },
  {
    id: 'ach_4',
    title: 'Hydration Hero',
    category: 'nutrition',
    description: 'Reached your full 8-glass daily water benchmark for 4 days',
    iconName: 'Droplets',
    unlocked: true,
    progress: 4,
    maxProgress: 4,
    unlockedDate: 'Nov 05, 2026'
  },
  {
    id: 'ach_5',
    title: 'Metabolic Centurion',
    category: 'metabolic',
    description: 'Attain a 95+ Metabolic Aura Score for 3 days in a single week',
    iconName: 'Award',
    unlocked: false,
    progress: 1,
    maxProgress: 3
  },
  {
    id: 'ach_6',
    title: 'Fiber Champion',
    category: 'nutrition',
    description: 'Achieve 35g+ of natural soluble and prebiotic fiber in a day',
    iconName: 'Sparkles',
    unlocked: true,
    progress: 38,
    maxProgress: 35,
    unlockedDate: 'Nov 05, 2026'
  }
];
