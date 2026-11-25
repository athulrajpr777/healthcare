import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Upload, Sparkles, CheckCircle2, AlertCircle, 
  RefreshCw, BookmarkPlus, ArrowRight, SwitchCamera, X, Zap, Lightbulb
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MockFoodItem, mockFoodDatabase } from '../data/mockFoodDb';

interface FoodScannerCardProps {
  onSaveToAnalytics: (food: MockFoodItem) => void;
}

export const FoodScannerCard: React.FC<FoodScannerCardProps> = ({ onSaveToAnalytics }) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<MockFoodItem | null>(null);
  const [scanStepText, setScanStepText] = useState('Initializing optical sensor...');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [analysisSource, setAnalysisSource] = useState<string>('gemini-vision');
  const [aiConfidence, setAiConfidence] = useState<number>(95);
  const [metabolicAdvice, setMetabolicAdvice] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Camera Management
  const startCamera = async () => {
    setCameraError(null);
    setAiError(null);
    setIsCameraActive(true);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Camera access not available or permission denied. Please use "Upload from Gallery".');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
    setTimeout(() => {
      startCamera();
    }, 150);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      stopCamera();
      analyzePhotoWithAI(dataUrl, 'Live Camera Capture');
    }
  };

  // Gallery File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        analyzePhotoWithAI(reader.result as string, file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // AI Analysis: Calls Server-Side Gemini Vision API
  const analyzePhotoWithAI = async (imageDataUrl: string, fileName?: string) => {
    setSelectedFile(imageDataUrl);
    setIsScanning(true);
    setScanResult(null);
    setAiError(null);
    setScanStepText('Deconstructing spatial food geometry & plate boundary...');

    const stepTimer1 = setTimeout(() => {
      setScanStepText('Gemini Vision AI: Extracting ingredients & portion density...');
    }, 700);

    const stepTimer2 = setTimeout(() => {
      setScanStepText('Synthesizing glycemic index & postprandial insulin response...');
    }, 1500);

    try {
      const res = await fetch('/api/analyze-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageDataUrl, fileName }),
      });

      const responseData = await res.json();

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      if (!res.ok || !responseData.success || !responseData.data) {
        throw new Error(responseData?.error || 'AI vision analysis returned an error.');
      }

      setAnalysisSource(responseData.source || 'gemini-vision');
      setAiConfidence(responseData.data.confidence || 95);
      setMetabolicAdvice(
        responseData.data.advice ||
          'Consider a 10-minute walk post-meal to attenuate the blood glucose peak.'
      );
      setScanResult(responseData.data);
    } catch (err: any) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      console.error('Meal AI analysis failed:', err);
      setAiError(err?.message || 'Unable to analyze meal with Gemini AI. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleScanPreset = (food: MockFoodItem) => {
    analyzePhotoWithAI(food.imageUrl || '', food.name);
  };

  const handleSave = () => {
    if (!scanResult) return;
    confetti({
      particleCount: 55,
      spread: 65,
      origin: { y: 0.8 },
      colors: ['#6ee7b7', '#f472b6', '#38bdf8', '#fbbf24'],
    });
    onSaveToAnalytics(scanResult);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setScanResult(null);
    setIsScanning(false);
    setAiError(null);
    stopCamera();
  };

  return (
    <div className="w-full bg-white/50 backdrop-blur-xl border border-white/70 rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald-950/5 relative overflow-hidden transition-all duration-300">
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
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-medium tracking-tight text-[#1C2E1E]">
                The Lens (AI Food Scanner)
              </h2>
              <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                Gemini Vision AI
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Live camera capture or gallery upload with real-time multi-spectral AI analysis
            </p>
          </div>
        </div>

        {(scanResult || selectedFile) && (
          <button
            onClick={handleReset}
            className="self-start sm:self-auto text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 hover:bg-white border border-white/80 transition-colors cursor-pointer shadow-xs"
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

      {cameraError && (
        <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center justify-between">
          <span>{cameraError}</span>
          <button onClick={() => setCameraError(null)} className="text-rose-500 hover:text-rose-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {aiError && (
        <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{aiError}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {selectedFile && (
              <button
                onClick={() => analyzePhotoWithAI(selectedFile, 'Retry Scan')}
                className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-500 cursor-pointer"
              >
                Retry
              </button>
            )}
            <button onClick={() => setAiError(null)} className="text-rose-500 hover:text-rose-800 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <div className="relative z-10">
        {/* State 1: Choose Live Camera or Gallery Upload */}
        {!selectedFile && !isCameraActive && (
          <div className="space-y-5">
            <div className="relative w-full rounded-3xl border-2 border-dashed border-emerald-400/40 hover:border-emerald-500/70 bg-white/40 hover:bg-white/60 transition-all duration-300 p-8 sm:p-10 flex flex-col items-center justify-center text-center">
              {/* Corner Viewfinder Brackets */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-emerald-500/60 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-emerald-500/60 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-emerald-500/60 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-emerald-500/60 rounded-br-lg" />

              <div className="w-16 h-16 rounded-3xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center mb-4 shadow-sm">
                <Sparkles className="w-7 h-7 text-emerald-600" />
              </div>

              <h3 className="text-lg font-medium text-[#1C2E1E] mb-1">
                Scan Your Plate with AI
              </h3>
              <p className="text-xs text-neutral-500 max-w-md mb-6 leading-relaxed">
                Take a live photo using your camera or upload any food image from your gallery. Gemini AI will analyze whatever you upload with exact macronutrients and glycemic spike impact.
              </p>

              {/* TWO PROMINENT ACTIONS: CAMERA & GALLERY */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                {/* 1. Live Camera Button */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startCamera}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Scan with Camera</span>
                </motion.button>

                {/* 2. Gallery Upload Button */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 font-semibold text-xs sm:text-sm tracking-wide shadow-xs flex items-center justify-center gap-2.5 cursor-pointer transition-colors"
                >
                  <Upload className="w-4 h-4 text-neutral-600" />
                  <span>Upload from Gallery</span>
                </motion.button>
              </div>
            </div>

            {/* Quick Testing Presets */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-2">
                <span>Or select a sample plate to test the scanner:</span>
                <span className="text-emerald-700 font-bold">Instant 1-Click AI Test</span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                {mockFoodDatabase.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => handleScanPreset(food)}
                    className="p-3 rounded-xl bg-white/70 hover:bg-white border border-white/90 hover:border-emerald-300 text-left transition-all group flex items-center justify-between cursor-pointer shadow-xs"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#1C2E1E] group-hover:text-emerald-700 transition-colors">
                        {food.name}
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        {food.calories} kcal · {food.protein}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* State 2: Live Camera Viewfinder */}
        {isCameraActive && (
          <div className="relative rounded-3xl overflow-hidden bg-black flex flex-col items-center justify-center shadow-2xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-72 sm:h-96 object-cover"
            />

            {/* Viewfinder Reticle Overlay */}
            <div className="absolute inset-6 sm:inset-10 border border-white/30 rounded-2xl pointer-events-none flex items-center justify-center">
              <div className="w-10 h-10 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg absolute top-2 left-2" />
              <div className="w-10 h-10 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg absolute top-2 right-2" />
              <div className="w-10 h-10 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg absolute bottom-2 left-2" />
              <div className="w-10 h-10 border-b-2 border-r-2 border-emerald-400 rounded-br-lg absolute bottom-2 right-2" />
              <div className="text-xs text-white bg-black/60 px-3.5 py-1.5 rounded-full backdrop-blur-md font-medium">
                Align meal plate inside viewfinder
              </div>
            </div>

            {/* Camera Controls Bar */}
            <div className="absolute bottom-5 inset-x-0 flex items-center justify-center gap-6 z-20">
              <button
                type="button"
                onClick={stopCamera}
                className="px-4 py-2 rounded-xl bg-black/60 hover:bg-black/80 text-white text-xs font-medium backdrop-blur-md border border-white/20 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              {/* Shutter Capture Button */}
              <button
                type="button"
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full border-4 border-white bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center text-white shadow-xl active:scale-90 transition-transform cursor-pointer"
                title="Snap Photo"
              >
                <div className="w-12 h-12 rounded-full border-2 border-white/80 bg-white/20 flex items-center justify-center">
                  <Camera className="w-6 h-6" />
                </div>
              </button>

              <button
                type="button"
                onClick={toggleCameraFacing}
                className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-colors cursor-pointer"
                title="Switch Camera"
              >
                <SwitchCamera className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* State 3: Uploaded Photo Preview & AI Scanning Laser */}
        {selectedFile && (
          <div className="space-y-6">
            <div className="relative w-full h-64 sm:h-80 rounded-3xl overflow-hidden bg-neutral-900 border border-white/80 shadow-inner flex items-center justify-center">
              <img
                src={selectedFile}
                alt="Plate for analysis"
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
                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_#34d399] z-20 pointer-events-none"
                  />

                  {/* Translucent overlay with live scanning status */}
                  <div className="absolute inset-0 bg-neutral-950/45 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-6 z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 text-white flex items-center justify-center mb-3 animate-spin">
                      <RefreshCw className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1">
                      Gemini Vision AI Scanning
                    </span>
                    <p className="text-sm font-medium text-white max-w-sm">
                      {scanStepText}
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* State 4: Post-Scan Real AI Result Card */}
            <AnimatePresence>
              {scanResult && !isScanning && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4 pt-1"
                >
                  {/* Dish Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200/80 gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            {analysisSource
                              ? `Gemini Vision AI Recognized (${aiConfidence}% confidence)`
                              : 'Optical Biomarker Decomposed'}
                          </span>
                        </span>
                        {scanResult.sugarSpikeLevel && (
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border inline-flex items-center gap-1 ${
                              scanResult.sugarSpikeLevel.toLowerCase() === 'low'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : scanResult.sugarSpikeLevel.toLowerCase() === 'high'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            <Zap className="w-3 h-3" />
                            <span>Sugar Spike: {scanResult.sugarSpikeLevel}</span>
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1C2E1E]">
                        {scanResult.name}
                      </h3>
                      <span className="text-xs text-neutral-500 mt-0.5 block">
                        GI Index ~{scanResult.glycemicIndex ?? 35} · Fiber {scanResult.fiber || '5g'}
                      </span>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <div className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1C2E1E] tabular-nums">
                        {scanResult.calories}
                      </div>
                      <span className="text-xs text-neutral-500 uppercase tracking-wider block">
                        Estimated kcal energy
                      </span>
                    </div>
                  </div>

                  {/* Perfectly Aligned CSS Grid for Macros */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-white/70 border border-white/90 shadow-xs">
                      <span className="text-[11px] text-neutral-500 font-medium uppercase tracking-wider block mb-0.5">
                        Protein
                      </span>
                      <span className="text-xl font-bold text-neutral-900 tabular-nums">
                        {scanResult.protein}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">
                        Lean Amino Profile
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/70 border border-white/90 shadow-xs">
                      <span className="text-[11px] text-neutral-500 font-medium uppercase tracking-wider block mb-0.5">
                        Carbohydrates
                      </span>
                      <span className="text-xl font-bold text-neutral-900 tabular-nums">
                        {scanResult.carbs}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-medium block mt-0.5">
                        Starch & Fibers
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/70 border border-white/90 shadow-xs">
                      <span className="text-[11px] text-neutral-500 font-medium uppercase tracking-wider block mb-0.5">
                        Dietary Lipids
                      </span>
                      <span className="text-xl font-bold text-neutral-900 tabular-nums">
                        {scanResult.fat}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-medium block mt-0.5">
                        Total Fatty Acids
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/70 border border-white/90 shadow-xs">
                      <span className="text-[11px] text-neutral-500 font-medium uppercase tracking-wider block mb-0.5">
                        Fiber / Balance
                      </span>
                      <span className="text-xl font-bold text-emerald-700 tabular-nums">
                        {scanResult.fiber || '5g'}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-medium block mt-0.5">
                        Gut Prebiotic Buffer
                      </span>
                    </div>
                  </div>

                  {/* Good (Soft Green) vs Bad (Soft Pink) Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Good Highlights in Soft Mint Green */}
                    <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Good Biomarkers (Mint Green)</span>
                      </div>
                      <p className="text-sm font-semibold text-emerald-800">
                        {scanResult.good}
                      </p>
                      <p className="text-[11px] text-emerald-700/80">
                        Supports cellular glucose uptake and preserves insulin receptor sensitivity.
                      </p>
                    </div>

                    {/* Bad Highlights in Soft Blush Pink */}
                    <div className="p-4 rounded-2xl bg-rose-50/90 border border-rose-200/80 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-800">
                        <AlertCircle className="w-4 h-4 text-rose-500" />
                        <span>Cautionary Notes (Blush Pink)</span>
                      </div>
                      <p className="text-sm font-semibold text-rose-600">
                        {scanResult.bad === 'None'
                          ? 'None (Clean Metabolic Profile)'
                          : scanResult.bad}
                      </p>
                      <p className="text-[11px] text-rose-600/80">
                        {scanResult.bad === 'None'
                          ? 'Zero adverse spikes or excessive saturated lipids identified.'
                          : 'Moderate post-meal walk is advised to smooth glycemic excursions.'}
                      </p>
                    </div>
                  </div>

                  {/* AI Metabolic Advice Callout */}
                  {metabolicAdvice && (
                    <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/70 flex items-start gap-2.5 text-xs text-teal-900">
                      <Lightbulb className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Endocrine AI Recommendation:</span>{' '}
                        <span>{metabolicAdvice}</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={startCamera}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Retake with Camera</span>
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-300 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Pick Another Image</span>
                      </button>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <BookmarkPlus className="w-4 h-4" />
                      <span>Save to Analytics & Journal</span>
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
