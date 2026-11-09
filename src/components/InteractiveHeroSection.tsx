import React, { useEffect, useRef } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';
import { Sparkles, Camera, ArrowDown, Footprints, Flame, Activity } from 'lucide-react';

interface InteractiveHeroSectionProps {
  steps: number;
  onScanClick: () => void;
  onScrollDown: () => void;
}

export const InteractiveHeroSection: React.FC<InteractiveHeroSectionProps> = ({
  steps,
  onScanClick,
  onScrollDown,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { displayed, done } = useTypewriter('Nourish to flourish.', 55, 300);

  // Silky-Smooth Mouse Scrubbing Loop
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Mobile / Touch devices fallback: auto-play smooth loop
    if (window.innerWidth < 1024) {
      video.autoplay = true;
      video.loop = true;
      video.play().catch(() => {});
      return;
    }

    video.pause();

    let targetTime = 0;
    let currentTime = 0;
    let rafId: number | null = null;
    let isSeeking = false;

    // Smooth physics-based interpolation loop (lerp)
    const renderLoop = () => {
      if (video && !isNaN(video.duration) && video.duration > 0) {
        const diff = targetTime - currentTime;
        if (Math.abs(diff) > 0.002) {
          currentTime += diff * 0.18; // Smooth damping factor
          if (!isSeeking) {
            isSeeking = true;
            video.currentTime = Math.max(0, Math.min(video.duration - 0.02, currentTime));
          }
        }
      }
      rafId = requestAnimationFrame(renderLoop);
    };

    const handleSeeked = () => {
      isSeeking = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return;
      if (!video || isNaN(video.duration) || video.duration <= 0) return;

      // Map horizontal cursor position across the entire viewport to video duration
      const progress = Math.max(0, Math.min(1, e.clientX / window.innerWidth));
      targetTime = progress * video.duration;
    };

    video.addEventListener('seeked', handleSeeked);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafId = requestAnimationFrame(renderLoop);

    return () => {
      video.removeEventListener('seeked', handleSeeked);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const caloriesBurned = Math.round(steps * 0.04);

  return (
    <section id="hero-section" className="relative w-full min-h-[90vh] lg:min-h-screen flex items-center overflow-hidden">
      {/* 3D ANIMATION VIDEO: Full-bleed background layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none w-full h-full">
        <video
          ref={videoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4"
          className="w-full h-full object-cover object-center lg:object-right"
          muted
          playsInline
          preload="auto"
          loop
        />
        {/* Soft pearl scrim overlays: keep 3D video vibrant while ensuring text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-white/20 lg:to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAFBF9] via-transparent to-transparent pointer-events-none" />
      </div>

      {/* CONTENT OVERLAY: Directly positioned over the 3D video */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-28 pb-16 flex flex-col justify-center min-h-[90vh] lg:min-h-screen">
        <div className="max-w-2xl">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-semibold mb-6 shadow-xs backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#34d399]" />
            <span>Interactive 3D Metabolic Avatar Active</span>
          </div>

          {/* Typewriter Daily Health Quote Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[76px] font-light tracking-tight text-[#1C2E1E] leading-[1.08] mb-6 whitespace-pre-wrap select-none">
            {displayed}
            {!done && (
              <span className="inline-block w-[3px] h-[0.9em] bg-[#1C2E1E] ml-1.5 align-middle animate-blink" />
            )}
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed mb-8 max-w-xl">
            Move your cursor across the screen to rotate your metabolic model in real time. Deconstruct food photos for complete macronutrients and track postprandial walking burn below.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 mb-10">
            <button
              onClick={onScanClick}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-lg shadow-emerald-600/25 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Scan Meal with Lens</span>
            </button>

            <button
              onClick={onScrollDown}
              className="px-5 py-3.5 rounded-2xl bg-white/70 hover:bg-white border border-neutral-200/80 text-neutral-800 font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>View Dashboard</span>
              <ArrowDown className="w-4 h-4 text-neutral-500" />
            </button>
          </div>

          {/* Quick HUD Metrics Strip on the Overlay */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-neutral-200/70 max-w-lg">
            <div className="p-3 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-0.5">
                <Footprints className="w-3.5 h-3.5 text-rose-500" />
                <span>Steps Today</span>
              </div>
              <div className="text-xl font-bold text-[#1C2E1E] tabular-nums">
                {steps.toLocaleString()}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs text-rose-600 mb-0.5">
                <Flame className="w-3.5 h-3.5" />
                <span>Walking Burn</span>
              </div>
              <div className="text-xl font-bold text-rose-600 tabular-nums">
                -{caloriesBurned}{' '}
                <span className="text-xs font-normal text-neutral-500">kcal</span>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 mb-0.5">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                <span>Metabolic Aura</span>
              </div>
              <div className="text-xl font-bold text-emerald-700 tabular-nums">
                89 <span className="text-xs font-normal text-neutral-500">/ 100</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
