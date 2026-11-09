import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Camera, Upload, Sparkles, CheckCircle2, AlertTriangle, 
  Flame, ShieldCheck, HeartPulse, ChevronRight, RefreshCw, Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { analyzeMealPhoto, ScanAnalysisResult } from '../services/geminiScanner';
import { MealLog } from '../types';
import { presetScanFoods } from '../data/seedData';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMeal: (meal: MealLog) => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  onSaveMeal,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [scanProgress, setScanProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<ScanAnalysisResult | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera on unmount or close
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      resetState();
    }
  }, [isOpen]);

  const resetState = () => {
    setSelectedImage(null);
    setIsScanning(false);
    setScanProgress(0);
    setAnalysisResult(null);
    stopCamera();
  };

  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access was not granted or unavailable:', err);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        stopCamera();
        processImage(dataUrl, 'Camera Capture Plate');
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        processImage(dataUrl, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetSelect = (preset: typeof presetScanFoods[0]) => {
    processImage(preset.imageUrl, preset.name);
  };

  const processImage = async (imageUrl: string, hint?: string) => {
    setSelectedImage(imageUrl);
    setIsScanning(true);
    setAnalysisResult(null);
    setScanProgress(15);
    setScanStep('Deconstructing spatial food geometry & plate boundary...');

    // Animated scanning progress steps
    setTimeout(() => {
      setScanProgress(45);
      setScanStep('Spectrophotometric macro estimation: Protein & Fiber...');
    }, 700);

    setTimeout(() => {
      setScanProgress(78);
      setScanStep('Synthesizing glycemic index & postprandial glucose curve...');
    }, 1400);

    try {
      const result = await analyzeMealPhoto(imageUrl, hint);
      setTimeout(() => {
        setScanProgress(100);
        setIsScanning(false);
        setAnalysisResult(result);
      }, 1900);
    } catch (error) {
      setIsScanning(false);
    }
  };

  const handleSaveToJournal = () => {
    if (!analysisResult || !selectedImage) return;

    // Trigger celebratory confetti burst
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#34d399', '#f472b6', '#38bdf8', '#fbbf24']
    });

    const newMeal: MealLog = {
      id: `meal_${Date.now()}`,
      name: analysisResult.name,
      timestamp: 'Today · ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mealType: analysisResult.mealType,
      imageUrl: selectedImage,
      calories: analysisResult.calories,
      protein: analysisResult.protein,
      carbs: analysisResult.carbs,
      fat: analysisResult.fat,
      fiber: analysisResult.fiber,
      sugar: analysisResult.sugar,
      glycemicLoad: analysisResult.glycemicLoad,
      glycemicIndexValue: analysisResult.glycemicIndexValue,
      glycemicSpikeEstimate: analysisResult.glycemicSpikeEstimate,
      goodHighlights: analysisResult.goodHighlights,
      cautionaryMacros: analysisResult.cautionaryMacros,
      micronutrients: analysisResult.micronutrients,
      glucoseCurve: analysisResult.glucoseCurve,
    };

    onSaveMeal(newMeal);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                GlycoLens Metabolic Scanner
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Multi-spectral macro decomposition & glycemic load modeling
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {!selectedImage && !cameraActive && (
            <div>
              {/* Viewfinder upload dropzone */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative h-64 sm:h-72 rounded-3xl border-2 border-dashed border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/5 dark:bg-emerald-950/20 flex flex-col items-center justify-center text-center p-6 cursor-pointer transition-all duration-300 group overflow-hidden"
              >
                {/* Viewfinder corner brackets */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-emerald-500/70 rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-emerald-500/70 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-emerald-500/70 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-emerald-500/70 rounded-br-lg" />

                {/* Pulsing targeting reticle */}
                <div className="w-16 h-16 rounded-full border border-emerald-500/40 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform relative">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div className="absolute inset-0 rounded-full border border-emerald-400 animate-ping opacity-30" />
                </div>

                <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
                  Position plate inside viewfinder
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4">
                  Drag and drop a food photo here, or click to browse from device.
                </p>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      startCamera();
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-transform active:scale-95"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Use Live Camera</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-2 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                  </button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Instant Preset Plates for Quick Evaluation */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Or try instant food presets:
                  </span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400">1-click AI scan</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {presetScanFoods.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePresetSelect(preset)}
                      className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-emerald-500/5 flex items-center gap-3 text-left transition-all group"
                    >
                      <img
                        src={preset.imageUrl}
                        alt={preset.name}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform"
                      />
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {preset.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{preset.calories} kcal</span>
                          <span>·</span>
                          <span>{preset.protein}g protein</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Live Camera View */}
          {cameraActive && (
            <div className="relative rounded-3xl overflow-hidden bg-black flex flex-col items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-72 sm:h-80 object-cover"
              />
              {/* Reticle Overlay */}
              <div className="absolute inset-8 border border-white/40 rounded-2xl pointer-events-none flex items-center justify-center">
                <div className="w-12 h-12 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg absolute top-2 left-2" />
                <div className="w-12 h-12 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg absolute top-2 right-2" />
                <div className="w-12 h-12 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg absolute bottom-2 left-2" />
                <div className="w-12 h-12 border-b-2 border-r-2 border-emerald-400 rounded-br-lg absolute bottom-2 right-2" />
                <div className="text-xs text-white/80 bg-black/50 px-3 py-1 rounded-full backdrop-blur-xs">
                  Center dish in frame
                </div>
              </div>

              {/* Shutter Button */}
              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
                <button
                  onClick={stopCamera}
                  className="px-3 py-1.5 rounded-xl bg-black/60 text-white text-xs backdrop-blur-md"
                >
                  Cancel
                </button>
                <button
                  onClick={capturePhoto}
                  className="w-14 h-14 rounded-full border-4 border-white bg-emerald-500 flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform"
                >
                  <Camera className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          {/* Scanning Animation Progress View */}
          {isScanning && selectedImage && (
            <div className="space-y-4">
              <div className="relative h-64 sm:h-72 rounded-3xl overflow-hidden border border-emerald-500/30">
                <img
                  src={selectedImage}
                  alt="Analyzing plate"
                  className="w-full h-full object-cover filter brightness-75"
                />

                {/* Laser scan beam */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399] animate-scanline" />

                {/* Scanner HUD Overlay */}
                <div className="absolute inset-0 bg-emerald-950/20 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-6">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-3 animate-spin">
                    <RefreshCw className="w-7 h-7" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">
                    AI Lens Optical Deconstruction
                  </h4>
                  <p className="text-xs text-emerald-300/90 font-medium max-w-sm">
                    {scanStep}
                  </p>

                  <div className="w-56 bg-white/20 h-2 rounded-full mt-4 overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Post-Upload Result Card */}
          {analysisResult && !isScanning && (
            <div className="space-y-5 animate-fade-in">
              {/* Dish Header Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt={analysisResult.name}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Optical Biomarker Match ({analysisResult.confidenceScore}% confidence)</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white truncate">
                    {analysisResult.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span>{analysisResult.mealType}</span>
                    <span>·</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      GI {analysisResult.glycemicIndexValue} ({analysisResult.glycemicLoad} Impact)
                    </span>
                  </div>
                </div>

                {/* Total Calories Spotlight */}
                <div className="sm:text-right shrink-0 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                    Total Energy
                  </span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                    {analysisResult.calories}
                  </div>
                  <span className="text-[11px] text-slate-500">kcal total</span>
                </div>
              </div>

              {/* Good Macros (Mint Green) vs Cautionary (Blush Pink) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Good Macros Highlighted */}
                <div className="p-4 rounded-3xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Good Macros & Bio-Protective</span>
                  </div>

                  {/* Highlight pills */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/20">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Protein</div>
                      <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {analysisResult.protein}g
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Optimal amino build</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/20">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Dietary Fiber</div>
                      <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {analysisResult.fiber}g
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Prebiotic cushion</div>
                    </div>
                  </div>

                  {/* Bullet highlights */}
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {analysisResult.goodHighlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Micronutrients */}
                  {analysisResult.micronutrients?.length > 0 && (
                    <div className="pt-2 border-t border-emerald-500/20">
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                        Key Micronutrients & Vitamins:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {analysisResult.micronutrients.map((micro, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-medium"
                          >
                            {micro.name}: {micro.amount} ({micro.dailyValuePct}% DV)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Cautionary Macros (Blush Pink / Rose) */}
                <div className="p-4 rounded-3xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
                    <HeartPulse className="w-4 h-4 text-rose-500" />
                    <span>Cautionary Macros & Glycemic Spike</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-500/20">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Total Fats</div>
                      <div className="text-lg font-black text-rose-500 dark:text-rose-400 tabular-nums">
                        {analysisResult.fat}g
                      </div>
                      <div className="text-[10px] text-slate-500">Monitor lipid target</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-500/20">
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Net Carbs / Sugars</div>
                      <div className="text-lg font-black text-rose-500 dark:text-rose-400 tabular-nums">
                        {analysisResult.carbs}g <span className="text-xs font-normal text-slate-400">({analysisResult.sugar}g sug)</span>
                      </div>
                      <div className="text-[10px] text-slate-500">Glycemic response</div>
                    </div>
                  </div>

                  {/* Caution Notes */}
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {analysisResult.cautionaryMacros.map((caution, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500 mt-0.5 shrink-0" />
                        <span>{caution}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Glycemic Spike Estimate */}
                  <div className="pt-2 border-t border-rose-500/20 text-xs">
                    <div className="font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                      Estimated Postprandial Spike:
                    </div>
                    <div className="text-rose-600 dark:text-rose-400 font-bold">
                      {analysisResult.glycemicSpikeEstimate}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2-Hour Predicted Blood Glucose Curve Chart */}
              {analysisResult.glucoseCurve && (
                <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                      Predicted 2-Hour Postprandial Glucose Curve (mg/dL)
                    </span>
                    <span className="text-[11px] text-slate-500">Base ~88 mg/dL</span>
                  </div>

                  <div className="h-28 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analysisResult.glucoseCurve} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="glucoseGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#34d399" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#34d399" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="timeMinutes" 
                          tick={{ fontSize: 10, fill: '#94a3b8' }} 
                          tickFormatter={(v) => `${v}m`} 
                        />
                        <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 12, fontSize: 11, color: '#fff' }} 
                          formatter={(value: any) => [`${value} mg/dL`, 'Blood Glucose']}
                          labelFormatter={(label) => `${label} minutes after meal`}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="glucoseMgDl" 
                          stroke="#10b981" 
                          strokeWidth={2.5} 
                          fillOpacity={1} 
                          fill="url(#glucoseGrad)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={resetState}
                  className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                >
                  Retake Photo
                </button>
                <button
                  onClick={handleSaveToJournal}
                  className="flex-1 py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-600/30 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Save to Journal & Update Analytics</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
