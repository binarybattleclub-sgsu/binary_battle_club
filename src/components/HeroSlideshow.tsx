import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { HERO_SLIDES, SlideItem } from '../data/slidesData';

export const HeroSlideshow: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = HERO_SLIDES.length;
  const currentSlide: SlideItem = HERO_SLIDES[currentIndex] || HERO_SLIDES[0];

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex((index + totalSlides) % totalSlides);
  }, [totalSlides]);

  const handleNext = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const handlePrev = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  // Autoplay management (5000ms interval, 700ms transition)
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isPaused || prefersReducedMotion || totalSlides <= 1) {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
      return;
    }

    autoplayTimerRef.current = setInterval(() => {
      handleNext();
    }, 5000);

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    };
  }, [currentIndex, isPaused, totalSlides, handleNext]);

  // Pause on tab visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.visibilityState === 'hidden');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  // Touch swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  const formattedSlideNum = String(currentIndex + 1).padStart(2, '0');
  const formattedTotal = String(totalSlides).padStart(2, '0');

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Binary Battle Club Member Photo Slideshow"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#243650] hover:border-[#38BDF8]/50 shadow-[0_20px_50px_rgba(8,13,24,0.9)] aspect-[4/3] sm:aspect-[14/10] bg-[#101D35] group select-none transition-colors outline-none focus:ring-1 focus:ring-[#38BDF8]"
    >
      {/* Slides Container */}
      <div className="absolute inset-0">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;

          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Blurred Background Layer (for portrait & landscape photos, not transparent) */}
              {!slide.isTransparent ? (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <img
                    src={slide.src}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover filter blur-2xl opacity-35 scale-125 transform transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-[#080D18]/50" />
                </div>
              ) : (
                /* Clean Midnight Navy gradient for transparent images */
                <div className="absolute inset-0 bg-gradient-to-br from-[#101D35] via-[#080D18] to-[#101D35] pointer-events-none">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.15),transparent_70%)]" />
                </div>
              )}

              {/* Foreground Photo (100% Uncropped with object-contain) */}
              <div className="relative w-full h-full flex items-center justify-center p-3 sm:p-4 md:p-6 z-10">
                <img
                  src={slide.src}
                  alt={`Binary Battle Club Community Photo ${slide.slideNumber}`}
                  loading={index <= 2 ? 'eager' : 'lazy'}
                  className="max-h-full max-w-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                />
              </div>

              {/* Subtle Vignette Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080D18]/70 via-transparent to-black/20 pointer-events-none z-10" />
            </div>
          );
        })}
      </div>

      {/* Top Floating Badge: Club Identity Tag */}
      <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-2">
        <div className="px-3 py-1 rounded-full bg-[#080D18]/85 backdrop-blur-md border border-[#243650] text-[11px] font-mono tracking-wider text-[#DCE6F5] flex items-center gap-1.5 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
          <span>BBC COMMUNITY</span>
        </div>
      </div>

      {/* Top Right: Current Slide Counter */}
      <div className="absolute top-3.5 right-3.5 z-20">
        <div className="px-2.5 py-1 rounded-full bg-[#080D18]/85 backdrop-blur-md border border-[#243650] text-[11px] font-mono text-[#9FB0C8] shadow-md flex items-center gap-1">
          <span className="text-[#38BDF8] font-bold">{formattedSlideNum}</span>
          <span className="text-[#9FB0C8]/60">/</span>
          <span>{formattedTotal}</span>
        </div>
      </div>

      {/* Navigation Arrows (Visible on hover or keyboard focus, touch accessible) */}
      <div className="absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-2 sm:px-3 pointer-events-none">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous photograph"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#080D18]/80 hover:bg-[#2563EB] border border-[#243650] hover:border-[#38BDF8] text-[#DCE6F5] flex items-center justify-center backdrop-blur-md transition-all shadow-lg pointer-events-auto opacity-80 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-105"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next photograph"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#080D18]/80 hover:bg-[#2563EB] border border-[#243650] hover:border-[#38BDF8] text-[#DCE6F5] flex items-center justify-center backdrop-blur-md transition-all shadow-lg pointer-events-auto opacity-80 sm:opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-105"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Bottom Bar: Clickable Progress Indicators (15 Dots) & Autoplay Status */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between gap-3 px-3 py-1.5 rounded-xl bg-[#080D18]/80 backdrop-blur-md border border-[#243650]/80">
        {/* Progress Dots */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto max-w-[80%] py-0.5">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Jump to photo ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  isActive
                    ? 'w-4 sm:w-5 h-1.5 bg-[#38BDF8] shadow-[0_0_8px_rgba(56,189,248,0.7)]'
                    : 'w-1.5 h-1.5 bg-[#243650] hover:bg-[#9FB0C8]'
                }`}
              />
            );
          })}
        </div>

        {/* Pulse Indicator */}
        <div className="flex items-center gap-1 text-[10px] font-mono text-[#9FB0C8]/70 shrink-0">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
            }`}
          />
          <span className="hidden sm:inline">{isPaused ? 'PAUSED' : 'AUTO'}</span>
        </div>
      </div>
    </div>
  );
};
