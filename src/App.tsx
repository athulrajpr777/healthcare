import React, { useState, useEffect, useRef } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { GlycoLensNavbar } from './components/GlycoLensNavbar';
import { InteractiveHeroSection } from './components/InteractiveHeroSection';
import { FoodScannerCard } from './components/FoodScannerCard';
import { NutritionalAIChatCard } from './components/NutritionalAIChatCard';
import { AIMetabolicCoachCard } from './components/AIMetabolicCoachCard';
import { AnalyticsAndStepTracker, DayDataPoint } from './components/AnalyticsAndStepTracker';
import { MockFoodItem, mockFoodDatabase } from './data/mockFoodDb';
import { Sparkles, Trash2, AlertCircle, X } from 'lucide-react';
import {
  auth,
  logoutFirebase,
  testFirestoreConnection,
  syncUserProfile,
  saveUserDailySteps,
  saveFoodLogToFirestore,
  deleteFoodLogFromFirestore,
  subscribeToUserFoodLogs,
} from './firebase';

function parseReadableDbError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err || 'Cloud sync error');
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.error) {
      return `Cloud sync (${parsed.operationType || 'read/write'}): ${parsed.error}`;
    }
  } catch {
    // plain string
  }
  return raw;
}

export default function App() {
  // Global State
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('Athul Raj P. R.');
  const [userEmail, setUserEmail] = useState<string>('athulrajpr777@gmail.com');
  const [userPhoto, setUserPhoto] = useState<string | undefined>(undefined);
  const [firebaseUid, setFirebaseUid] = useState<string | null>(null);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);
  const [dailySteps, setDailySteps] = useState<number>(7420);
  const [metabolicScore, setMetabolicScore] = useState<number>(89);
  const [savedFoods, setSavedFoods] = useState<MockFoodItem[]>([
    mockFoodDatabase[2], // Default starter item for local preview before Firestore sync
  ]);

  const stepSyncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Chart data state
  const [chartData, setChartData] = useState<DayDataPoint[]>([
    { day: 'Mon', intake: 1950, burned: 440 },
    { day: 'Tue', intake: 2100, burned: 380 },
    { day: 'Wed', intake: 1820, burned: 512 },
    { day: 'Thu', intake: 2240, burned: 310 },
    { day: 'Fri', intake: 1980, burned: 420 },
    { day: 'Sat', intake: 2150, burned: 580 },
    { day: 'Sun (Today)', intake: 250, burned: Math.round(7420 * 0.04) },
  ]);

  // Keep today's chart intake/burned synced with savedFoods and dailySteps
  useEffect(() => {
    const todayIntake = savedFoods.reduce((sum, item) => sum + (Number(item.calories) || 0), 0);
    const todayBurned = Math.round(dailySteps * 0.04);
    setChartData((prev) => {
      const updated = [...prev];
      const todayIdx = updated.length - 1;
      if (todayIdx >= 0) {
        updated[todayIdx] = {
          ...updated[todayIdx],
          intake: todayIntake,
          burned: todayBurned,
        };
      }
      return updated;
    });
  }, [savedFoods, dailySteps]);

  // Save food from scanner or AI chat to state + Firestore
  const handleSaveToAnalytics = async (food: MockFoodItem) => {
    const foodWithId: MockFoodItem = {
      ...food,
      id: (food.id || `food_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '_'),
    };

    if (auth.currentUser && firebaseUid) {
      setSavedFoods((prev) => {
        if (prev.some((f) => f.id === foodWithId.id)) return prev;
        return [foodWithId, ...prev];
      });
      try {
        await saveFoodLogToFirestore(firebaseUid, foodWithId);
      } catch (err) {
        setFirebaseError(parseReadableDbError(err));
      }
    } else {
      setSavedFoods((prev) => [foodWithId, ...prev]);
    }
  };

  // Delete food entry
  const handleDeleteFood = async (foodId: string) => {
    setSavedFoods((prev) => prev.filter((f) => f.id !== foodId));
    if (auth.currentUser && firebaseUid) {
      try {
        await deleteFoodLogFromFirestore(firebaseUid, foodId);
      } catch (err) {
        setFirebaseError(parseReadableDbError(err));
      }
    }
  };

  // Step counter update handler (with debounced Firestore persistence)
  const handleStepsChange = (newSteps: number) => {
    setDailySteps(newSteps);
    if (auth.currentUser) {
      if (stepSyncTimeoutRef.current) {
        clearTimeout(stepSyncTimeoutRef.current);
      }
      const activeUser = auth.currentUser;
      stepSyncTimeoutRef.current = setTimeout(() => {
        saveUserDailySteps(activeUser, newSteps).catch((err) => {
          setFirebaseError(parseReadableDbError(err));
        });
      }, 2500);
    }
  };

  const scrollToLens = () => {
    const el = document.getElementById('lens-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToDashboard = () => {
    const el = document.getElementById('dashboard-suite');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Sync Firebase Auth state and Firestore foodLogs across sessions
  useEffect(() => {
    void testFirestoreConnection();
    let unsubscribeLogs: (() => void) | null = null;

    const unsubscribeAuth = auth.onAuthStateChanged(async (user) => {
      if (unsubscribeLogs) {
        unsubscribeLogs();
        unsubscribeLogs = null;
      }

      if (user) {
        setFirebaseUid(user.uid);
        setFirebaseError(null);
        setIsLoggedIn(true);
        setUserName(user.displayName || user.email?.split('@')[0] || 'Google User');
        setUserEmail(user.email || 'user@gmail.com');
        setUserPhoto(user.photoURL || undefined);
        setIsAuthChecking(false);

        try {
          const persistedSteps = await syncUserProfile(user, 7420);
          setDailySteps(persistedSteps);
        } catch (err) {
          setFirebaseError(parseReadableDbError(err));
        }

        unsubscribeLogs = subscribeToUserFoodLogs(
          user.uid,
          (logs) => {
            setSavedFoods(logs);
          },
          (err) => {
            setFirebaseError(parseReadableDbError(err));
          }
        );
      } else {
        setFirebaseUid(null);
        setIsAuthChecking(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeLogs) unsubscribeLogs();
      if (stepSyncTimeoutRef.current) clearTimeout(stepSyncTimeoutRef.current);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutFirebase();
    } catch (e) {
      console.warn('Firebase logout notice:', e);
    }
    setFirebaseUid(null);
    setUserPhoto(undefined);
    setFirebaseError(null);
    setDailySteps(7420);
    setSavedFoods([mockFoodDatabase[2]]);
    setIsLoggedIn(false);
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center gap-3 text-white">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-neutral-400">Connecting GlycoLens Health...</p>
      </div>
    );
  }

  // COMPONENT 1: LOGIN SCREEN (Strictly required if !isLoggedIn)
  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLogin={(name, email, photo) => {
          setUserName(name || 'Health Member');
          setUserEmail(email || 'member@glycolens.health');
          setUserPhoto(photo);
          setIsLoggedIn(true);
        }}
      />
    );
  }

  // MAIN APPLICATION (Rendered when isLoggedIn === true)
  return (
    <div className="flex flex-col min-h-screen bg-[#FAFBF9] text-neutral-900 overflow-x-hidden">
      {/* Top Fixed Navbar */}
      <GlycoLensNavbar
        userName={userName}
        userEmail={userEmail}
        userPhoto={userPhoto}
        onLogout={handleLogout}
        onScanClick={scrollToLens}
      />

      {/* Non-blocking Cloud Sync Error Banner */}
      {firebaseError && (
        <div className="fixed top-20 inset-x-0 z-40 max-w-3xl mx-auto px-4">
          <div className="p-3.5 rounded-2xl bg-rose-50/95 backdrop-blur-md border border-rose-200 text-xs text-rose-800 shadow-lg flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{firebaseError}</span>
            </div>
            <button
              type="button"
              onClick={() => setFirebaseError(null)}
              className="p-1 rounded-lg text-rose-500 hover:text-rose-800 cursor-pointer"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3D INTERACTIVE HERO SECTION: First thing seen after login */}
      <InteractiveHeroSection
        steps={dailySteps}
        metabolicScore={metabolicScore}
        onScanClick={scrollToLens}
        onScrollDown={scrollToDashboard}
      />

      {/* DASHBOARD SUITE: Cleanly scrollable directly below the hero */}
      <main id="dashboard-suite" className="max-w-7xl mx-auto py-16 sm:py-20 px-6 w-full space-y-12">
        {/* Section 1: The Lens (Food Scanner) */}
        <section id="lens-section" className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Multi-Spectral Food Decomposition</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-[#1C2E1E]">
                The Lens (Plate Scanner)
              </h2>
            </div>
            <p className="text-xs text-neutral-500 max-w-sm">
              Scan any meal photo or click a preset below to analyze protein, carbohydrates, healthy fats, and glycemic spike risk with Gemini Vision AI.
            </p>
          </div>

          <FoodScannerCard onSaveToAnalytics={handleSaveToAnalytics} />
        </section>

        {/* Section 2: Context-Aware Nutritional AI (Voice, Text & Photo Chat) */}
        <section id="ai-assistant-section" className="space-y-4 pt-4">
          <NutritionalAIChatCard onSaveToAnalytics={handleSaveToAnalytics} />
        </section>

        {/* Section 3: AI Metabolic Coach & Daily Insights */}
        <section id="ai-coach-section" className="space-y-4 pt-4">
          <AIMetabolicCoachCard
            savedFoods={savedFoods}
            dailySteps={dailySteps}
            onScoreUpdate={setMetabolicScore}
          />
        </section>

        {/* Section 4: Step Counter & Analytics Chart */}
        <section id="tracker-section" className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2">
            <div>
              <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-[#1C2E1E]">
                Metabolic Balance & Step Burn
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Live walking step counter subtracting calories directly from net intake
              </p>
            </div>
          </div>

          <AnalyticsAndStepTracker
            steps={dailySteps}
            onStepsChange={handleStepsChange}
            chartData={chartData}
            savedFoods={savedFoods}
          />
        </section>

        {/* Section 5: Saved Food Journal Log */}
        {savedFoods.length > 0 && (
          <section className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-950/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-lg font-medium tracking-tight text-[#1C2E1E]">
                  Today&apos;s Saved Food Logs ({savedFoods.length})
                </h3>
                <p className="text-xs text-neutral-500">
                  Continuous entries updating your 7-day caloric and glycemic history
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/80 w-fit">
                {savedFoods.reduce((acc, f) => acc + f.calories, 0)} Total Logged kcal
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {savedFoods.map((meal, idx) => (
                <div
                  key={`${meal.id}-${idx}`}
                  className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-xs flex flex-col justify-between group relative"
                >
                  <button
                    type="button"
                    onClick={() => handleDeleteFood(meal.id)}
                    title="Remove meal log"
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-3 mb-2.5 pr-6">
                    {meal.imageUrl && (
                      <img
                        src={meal.imageUrl}
                        alt={meal.name}
                        className="w-12 h-12 rounded-xl object-cover border border-neutral-200 shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[#1C2E1E] truncate">
                        {meal.name}
                      </h4>
                      <span className="text-[11px] text-neutral-500 block">
                        {meal.calories} kcal · {meal.protein} protein
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-100 text-[11px] space-y-1">
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Good:</span>
                      <span className="truncate max-w-[130px]">{meal.good}</span>
                    </div>
                    <div className="flex justify-between text-rose-600 font-medium">
                      <span>Caution:</span>
                      <span className="truncate max-w-[130px]">{meal.bad}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-200/80 py-8 px-6 text-center text-xs text-neutral-500 bg-white/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#1C2E1E]">GlycoLens Health</span>
            <span>·</span>
            <span>AI Multi-Spectral Nutrition & Step Tracker</span>
          </div>
          <span>Interactive 3D Avatar Engine Active</span>
        </div>
      </footer>
    </div>
  );
}
