import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ExternalLink, Users, ArrowUpRight } from 'lucide-react';
import { ProjectLabItem, getFeaturedProjects } from '../../data/projectLabData';

interface FeaturedProjectCarouselProps {
  projects?: ProjectLabItem[];
  onSelectProject: (project: ProjectLabItem) => void;
}

export const FeaturedProjectCarousel: React.FC<FeaturedProjectCarouselProps> = ({
  projects = getFeaturedProjects(),
  onSelectProject,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Determine items per view based on window width
  const getItemsCount = () => {
    if (typeof window === 'undefined') return 3;
    const width = window.innerWidth;
    if (width < 640) return 1;
    if (width < 1024) return 2;
    return 3;
  };

  const [itemsPerView, setItemsPerView] = useState<number>(getItemsCount);

  useEffect(() => {
    const updateItemsPerView = () => {
      setItemsPerView(getItemsCount());
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, projects.length - itemsPerView);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Autoplay functionality with pauses on hover, focus, and document hidden
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || isPaused || isDragging || maxIndex === 0) {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      return;
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      } else {
        startAutoplay();
      }
    };

    const startAutoplay = () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = setInterval(() => {
        handleNext();
      }, 4500);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    startAutoplay();

    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPaused, isDragging, handleNext, maxIndex]);

  // Drag and touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    setDragOffset(currentX - dragStartX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    if (dragOffset < -50) {
      handleNext();
    } else if (dragOffset > 50) {
      handlePrev();
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setDragOffset(e.clientX - dragStartX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    if (dragOffset < -60) {
      handleNext();
    } else if (dragOffset > 60) {
      handlePrev();
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  if (!projects || projects.length === 0) return null;

  return (
    <section
      aria-label="Featured Projects Carousel"
      className="space-y-4 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        if (isDragging) {
          setIsDragging(false);
          setDragOffset(0);
        }
      }}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Carousel Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#38BDF8]">
            FEATURED_INNOVATIONS // CAROUSEL
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            aria-label="Previous project slide"
            className="p-2 rounded-xl bg-[#101D35] hover:bg-[#172945] border border-[#243650] hover:border-[#38BDF8] text-[#9FB0C8] hover:text-[#DCE6F5] transition-all focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next project slide"
            className="p-2 rounded-xl bg-[#101D35] hover:bg-[#172945] border border-[#243650] hover:border-[#38BDF8] text-[#9FB0C8] hover:text-[#DCE6F5] transition-all focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Carousel Track Container */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="overflow-hidden rounded-3xl cursor-grab active:cursor-grabbing border border-[#243650]/60 bg-[#080D18]/60 p-2 sm:p-3"
      >
        <div
          className="flex transition-transform duration-500 ease-out gap-4"
          style={{
            transform: `translateX(calc(-${currentIndex * (100 / itemsPerView)}% - ${
              currentIndex * (16 / itemsPerView)
            }px + ${dragOffset}px))`,
          }}
        >
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => {
                if (Math.abs(dragOffset) < 10) {
                  onSelectProject(project);
                }
              }}
              style={{
                flex: `0 0 calc(${100 / itemsPerView}% - ${((itemsPerView - 1) * 16) / itemsPerView}px)`,
              }}
              className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#101D35] border border-[#243650] hover:border-[#38BDF8]/60 transition-all duration-300 shadow-lg hover:shadow-[0_12px_35px_rgba(8,13,24,0.9),0_0_20px_rgba(37,99,235,0.25)] flex flex-col cursor-pointer"
            >
              {/* Thumbnail Container (16:9) */}
              <div className="relative aspect-video w-full overflow-hidden bg-[#080D18]">
                <img
                  src={project.thumbnailAsset}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80';
                  }}
                />

                {/* Subtle Transparent Navy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080D18] via-[#080D18]/30 to-transparent pointer-events-none" />

                {/* Top Badges */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-[#080D18]/85 text-[#38BDF8] border border-[#243650] backdrop-blur-md shadow-xs">
                    {project.category}
                  </span>

                  {project.isCollaborative && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-[#2563EB]/90 text-white border border-[#38BDF8]/50 flex items-center gap-1 shadow-md">
                      <Users size={10} />
                      <span>COLLABORATIVE</span>
                    </span>
                  )}
                </div>

                {/* Hover Reveal Action Icon */}
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.6)] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                  <ArrowUpRight size={16} />
                </div>
              </div>

              {/* Slide Meta */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#DCE6F5] group-hover:text-[#38BDF8] transition-colors line-clamp-1 leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs text-[#9FB0C8] line-clamp-2 mt-1 leading-relaxed">
                    {project.tagline || project.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#243650]/60 flex items-center justify-between text-xs text-[#9FB0C8]">
                  <span className="font-mono text-[11px] truncate text-[#9FB0C8]/80">
                    By <span className="text-[#DCE6F5] font-semibold">{project.contributors.join(', ')}</span>
                  </span>
                  <span className="text-[#38BDF8] text-[11px] font-mono font-semibold shrink-0">
                    View Project →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination indicator dots */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Jump to slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              currentIndex === idx
                ? 'w-6 bg-[#38BDF8]'
                : 'w-2 bg-[#243650] hover:bg-[#9FB0C8]/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
};
