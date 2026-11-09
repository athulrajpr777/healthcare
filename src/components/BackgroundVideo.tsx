import React, { useEffect, useRef } from 'react';

export const BackgroundVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Mobile Autoplay Hook: Trigger normal playback for screens < 1024 width
    if (window.innerWidth < 1024) {
      video.autoplay = true;
      video.loop = true;
      video.play().catch(() => {});
      return;
    }

    // Desktop Mouse Scrubbing Hook
    video.pause();

    let prevX: number | null = null;
    let targetTime = 0;
    let isSeeking = false;
    let pendingTime: number | null = null;

    const applySeek = (time: number) => {
      if (!video || isNaN(video.duration) || video.duration <= 0) return;
      const clamped = Math.max(0.001, Math.min(video.duration - 0.01, time));
      
      if (!isSeeking) {
        isSeeking = true;
        video.currentTime = clamped;
      } else {
        pendingTime = clamped;
      }
    };

    const handleSeeked = () => {
      isSeeking = false;
      if (pendingTime !== null) {
        const nextTime = pendingTime;
        pendingTime = null;
        applySeek(nextTime);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return;
      if (!video || isNaN(video.duration) || video.duration <= 0) return;

      const currentX = e.clientX;
      if (prevX === null) {
        prevX = currentX;
        // Seed initial targetTime proportionally across the screen
        targetTime = (currentX / window.innerWidth) * video.duration;
        applySeek(targetTime);
        return;
      }

      const delta = currentX - prevX;
      prevX = currentX;

      // Update target scrub time based on (delta / window.innerWidth) * 0.8 * video.duration
      targetTime += (delta / window.innerWidth) * 0.8 * video.duration;
      // Clamp between 0 and duration
      targetTime = Math.max(0, Math.min(video.duration, targetTime));

      applySeek(targetTime);
    };

    const handleLoadedMetadata = () => {
      if (window.innerWidth < 1024) {
        video.play().catch(() => {});
      } else {
        video.currentTime = 0;
      }
    };

    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="order-last lg:order-none relative lg:absolute lg:inset-0 lg:z-0 overflow-hidden pointer-events-none w-full aspect-square md:aspect-video lg:aspect-auto lg:h-full bg-neutral-50 lg:bg-transparent">
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover object-right lg:object-right-bottom"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260601_110537_3a579fa0-7bbc-4d94-9d25-0e816c7840f5.mp4"
      />
    </div>
  );
};
