import React, { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { GlycoLensNavbar } from './components/GlycoLensNavbar';
import { InteractiveHeroSection } from './components/InteractiveHeroSection';
import { FoodScannerCard } from './components/FoodScannerCard';
import { AnalyticsAndStepTracker, DayDataPoint } from './components/AnalyticsAndStepTracker';
import { MockFoodItem, mockFoodDatabase } from './data/mockFoodDb';
import { Sparkles } from 'lucide-react';

export default function App() {
  // Global State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('Athul Raj P. R.');
  const [userEmail, setUserEmail] = useState<string>('athulrajpr777@gmail.com');
  const [dailySteps, setDailySteps] = useState<number>(7420);
  const [savedFoods, setSavedFoods] = useState<MockFoodItem[]>([
    mockFoodDatabase[2], // "Avocado Salad"
  ]);

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

  // Save food from scanner to analytics state
  const handleSaveToAnalytics = (food: MockFoodItem) => {
    setSavedFoods((prev) => [food, ...prev]);

    // Update today's caloric intake in the chart
    setChartData((prev) => {
      const updated = [...prev];
      const todayIdx = updated.length - 1;
      if (todayIdx >= 0) {
        updated[todayIdx] = {
          ...updated[todayIdx],
          intake: updated[todayIdx].intake + food.calories,
        };
      }
      return updated;
    });
  };

  // Step counter update handler
  const handleStepsChange = (newSteps: number) => {
    setDailySteps(newSteps);
    setChartData((prev) => {
      const updated = [...prev];
      const todayIdx = updated.length - 1;
      if (todayIdx >= 0) {
        updated[todayIdx] = {
          ...updated[todayIdx],
          burned: Math.round(newSteps * 0.04),
        };
      }
      return updated;
    });
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

  // COMPONENT 1: LOGIN SCREEN (Strictly required if !isLoggedIn)
  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLogin={(name, email) => {
          setUserName(name || 'Health Member');
          setUserEmail(email || 'member@glycolens.health');
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
        onLogout={() => setIsLoggedIn(false)}
        onScanClick={scrollToLens}
      />

      {/* 3D INTERACTIVE HERO SECTION: First thing seen after login */}
      <InteractiveHeroSection
        steps={dailySteps}
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
              Scan any meal photo or click a preset below to estimate protein, carbohydrates, healthy fats, and glycemic spike risk.
            </p>
          </div>

          <FoodScannerCard onSaveToAnalytics={handleSaveToAnalytics} />
        </section>

        {/* Section 2: Step Counter & Analytics Chart */}
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

        {/* Section 3: Saved Food Journal Log */}
        {savedFoods.length > 0 && (
          <section className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-950/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-lg font-medium tracking-tight text-[#1C2E1E]">
                  Today's Saved Food Logs ({savedFoods.length})
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
                  className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-xs flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3 mb-2.5">
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
