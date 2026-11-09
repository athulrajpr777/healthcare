import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Upload, Sparkles, CheckCircle2, AlertCircle, 
  Utensils, ArrowRight, RefreshCw, BookmarkPlus 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { mockFoodDatabase, MockFoodItem } from '../data/mockFoodDb';

interface FoodScannerCardProps {
  onSaveToAnalytics: (food: MockFoodItem) => void;
}

export const FoodScannerCard: React.FC<FoodScannerCardProps> = ({ onSaveToAnalytics }) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<MockFoodItem | null>(null);
  const [scanStepText, setScanStepText] = useState('Initializing optical sensor...');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startScan = (imageSrc: string, fileName?: string) => {
    setSelectedFile(imageSrc);
    setIsScanning(true);
    setScanResult(null);
    setScanStepText('Deconstructing spatial food geometry & plate boundary...');

    setTimeout(() => {
      setScanStepText('Spectrophotometric macro estimation: Protein & Fiber...');
    }, 700);

    setTimeout(() => {
      setScanStepText('Synthesizing glycemic index & postprandial impact...');
    }, 1400);

    setTimeout(() => {
      // Robust selection: Map by filename if matched, otherwise randomly select
      let selected: MockFoodItem | undefined;
      const lowerName = (fileName || '').toLowerCase();

      if (lowerName.includes('pasta') || lowerName.includes('tomato')) {
        selected = mockFoodDatabase.find(f => f.name === 'Tomato Pasta');
      } else if (lowerName.includes('dosa')) {
        selected = mockFoodDatabase.find(f => f.name === 'Masala Dosa');
      } else if (lowerName.includes('avocado') || lowerName.includes('salad')) {
        selected = mockFoodDatabase.find(f => f.name === 'Avocado Salad');
      } else if (lowerName.includes('chicken') || lowerName.includes('breast')) {
        selected = mockFoodDatabase.find(f => f.name === 'Chicken Breast');
      }

      if (!selected) {
        const randomIndex = Math.floor(Math.random() * mockFoodDatabase.length);
        selected = mockFoodDatabase[randomIndex];
      }

      setIsScanning(false);
      setScanResult(selected);
    }, 2100);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        startScan(reader.result as string, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScanPreset = (food: MockFoodItem) => {
    startScan(food.imageUrl, food.name);
  };

  const handleSave = () => {
    if (!scanResult) return;
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6ee7b7', '#f472b6', '#a7f3d0']
    });
    onSaveToAnalytics(scanResult);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setScanResult(null);
    setIsScanning(false);
  };

  return (
    <div className="w-full bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-6 md:p-8 shadow-xl shadow-emerald-950/5 relative overflow-hidden transition-all duration-300">
      {/* Soft glowing ambient lighting */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700 shadow-xs">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-medium tracking-tight text-[#1C2E1E]">
              The Lens (Dynamic Plate Scanner)
            </h2>
            <p className="text-xs text-neutral-500">
              AI multi-spectral macronutrient & biomarker decomposition
            </p>
          </div>
        </div>

        {scanResult && (
          <button
            onClick={handleReset}
            className="self-start sm:self-auto text-xs font-medium text-neutral-500 hover:text-neutral-800 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/60 hover:bg-white border border-white/80 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Scan Another</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload & Scanning Viewfinder */}
      <div className="relative z-10">
        {!selectedFile ? (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-full h-60 sm:h-72 rounded-2xl border-2 border-dashed border-emerald-400/40 hover:border-emerald-500/70 bg-white/30 hover:bg-white/50 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center p-6 group"
            >
              {/* Corner Viewfinder Brackets */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-emerald-500/60 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-emerald-500/60 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-emerald-500/60 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-emerald-500/60 rounded-br-lg" />

              <div className="w-16 h-16 rounded-full bg-emerald-100/70 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
                <Upload className="w-6 h-6" />
              </div>

              <p className="text-base font-medium text-[#1C2E1E] mb-1">
                Upload or drop plate photo here
              </p>
              <p className="text-xs text-neutral-500 max-w-sm mb-4">
                Position your meal inside the viewfinder to estimate calories, macros, and glycemic impact.
              </p>

              {/* Pulsing "Scan Plate" Motion Button */}
              <motion.button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(110, 231, 183, 0.45)',
                    '0 0 0 14px rgba(110, 231, 183, 0)',
                    '0 0 0 0 rgba(110, 231, 183, 0)',
                  ],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.2,
                  ease: 'easeInOut',
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium text-xs tracking-wide shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Scan Plate</span>
              </motion.button>
            </div>

            {/* Quick Preset Buttons for Instant Testing */}
            <div className="pt-2">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                Or select a preset dish to test the AI scanner:
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                {mockFoodDatabase.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => handleScanPreset(food)}
                    className="p-3 rounded-xl bg-white/60 hover:bg-white border border-white/80 hover:border-emerald-300 text-left transition-all group flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#1C2E1E] group-hover:text-emerald-700 transition-colors">
                        {food.name}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {food.calories} kcal · {food.protein}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Visual Box with Vertical Laser Line Sweeping Animation */}
            <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden bg-neutral-900 border border-white/60 shadow-inner flex items-center justify-center">
              <img
                src={selectedFile}
                alt="Uploaded plate"
                className="w-full h-full object-cover filter brightness-90"
              />

              {/* Viewfinder overlay corners */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg pointer-events-none" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-emerald-400 rounded-br-lg pointer-events-none" />

              {/* Framer Motion Vertical Green Laser Line Sweeping */}
              {isScanning && (
                <>
                  <motion.div
                    initial={{ top: '0%' }}
                    animate={{ top: ['0%', '95%', '0%'] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.8,
                      ease: 'easeInOut',
                    }}
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_18px_#34d399] z-20 pointer-events-none"
                  />

                  {/* Dark transparent scrim with live scanning status */}
                  <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-6 z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 text-white flex items-center justify-center mb-3 animate-spin">
                      <RefreshCw className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-1">
                      Scanning in Progress
                    </span>
                    <p className="text-sm font-medium text-white max-w-sm">
                      {scanStepText}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Post-Upload Result Card */}
            <AnimatePresence>
              {scanResult && !isScanning && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  {/* Dish Title & Total Calories */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200/70 gap-2">
                    <div>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60 inline-flex items-center gap-1 mb-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        AI Biomarker Identified
                      </span>
                      <h3 className="text-2xl font-semibold tracking-tight text-[#1C2E1E]">
                        {scanResult.name}
                      </h3>
                    </div>

                    <div className="sm:text-right">
                      <div className="text-3xl font-bold tracking-tight text-[#1C2E1E] tabular-nums">
                        {scanResult.calories}
                      </div>
                      <span className="text-xs text-neutral-500 uppercase tracking-wider">
                        kcal energy
                      </span>
                    </div>
                  </div>

                  {/* Perfectly Aligned CSS Grid for Macros */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-white/60 border border-white/80">
                      <span className="text-[11px] text-neutral-500 block mb-0.5">Protein</span>
                      <span className="text-lg font-bold text-neutral-900 tabular-nums">
                        {scanResult.protein}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/60 border border-white/80">
                      <span className="text-[11px] text-neutral-500 block mb-0.5">Carbohydrates</span>
                      <span className="text-lg font-bold text-neutral-900 tabular-nums">
                        {scanResult.carbs}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/60 border border-white/80">
                      <span className="text-[11px] text-neutral-500 block mb-0.5">Lipids & Fat</span>
                      <span className="text-lg font-bold text-neutral-900 tabular-nums">
                        {scanResult.fat}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/60 border border-white/80">
                      <span className="text-[11px] text-neutral-500 block mb-0.5">Fiber / Balance</span>
                      <span className="text-lg font-bold text-neutral-900 tabular-nums">
                        {scanResult.fiber || '4g'}
                      </span>
                    </div>
                  </div>

                  {/* Good (Soft Green) vs Bad (Soft Pink) Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Good Highlights */}
                    <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80">
                      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Good Biomarkers</span>
                      </div>
                      <p className="text-sm font-semibold text-emerald-700">
                        {scanResult.good}
                      </p>
                      <p className="text-[11px] text-emerald-600/90 mt-1">
                        Protects cellular insulin sensitivity and supports metabolic flexibility.
                      </p>
                    </div>

                    {/* Bad / Cautionary Highlights */}
                    <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200/80">
                      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-rose-800 mb-1">
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                        <span>Cautionary Notes</span>
                      </div>
                      <p className="text-sm font-semibold text-rose-600">
                        {scanResult.bad === 'None' ? 'None (Clean Metabolic Profile)' : scanResult.bad}
                      </p>
                      <p className="text-[11px] text-rose-600/90 mt-1">
                        {scanResult.bad === 'None'
                          ? 'Zero adverse glycemic spikes detected.'
                          : 'Consider a 10-minute postprandial walk to attenuate the blood glucose peak.'}
                      </p>
                    </div>
                  </div>

                  {/* "Save to Analytics" Action Button */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      onClick={handleReset}
                      className="px-4 py-2.5 rounded-2xl text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-white/60 hover:bg-white border border-white/80 transition-colors"
                    >
                      Clear
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs tracking-wide shadow-md shadow-emerald-600/25 flex items-center gap-2 cursor-pointer"
                    >
                      <BookmarkPlus className="w-4 h-4" />
                      <span>Save to Analytics</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};
