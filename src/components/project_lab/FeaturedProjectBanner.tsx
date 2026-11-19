import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Users,
  Eye,
  ArrowRight,
  Smartphone,
  Lock,
} from 'lucide-react';
import { GithubIcon } from '../SocialIcons';
import {
  ProjectLabItem,
  StudentProfile,
  getAllProjects,
  getStudentById,
} from '../../data/projectLabData';
import { ProjectThumbnail } from './ProjectThumbnail';

interface FeaturedProjectBannerProps {
  projects?: ProjectLabItem[];
  students?: StudentProfile[];
  onSelectProject: (project: ProjectLabItem) => void;
  onSelectStudent?: (student: StudentProfile) => void;
}

export const FeaturedProjectBanner: React.FC<FeaturedProjectBannerProps> = ({
  projects = getAllProjects(),
  students,
  onSelectProject,
  onSelectStudent,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const bannerRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = projects.length;
  // Guard against out of bounds if projects change dynamically
  const safeIndex = currentIndex >= totalSlides ? 0 : currentIndex;
  const currentProject = projects[safeIndex] || projects[0];

  // Helper for safe slide switching with animation cooldown
  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating || totalSlides === 0) return;
      setIsAnimating(true);
      setCurrentIndex((index + totalSlides) % totalSlides);
      setTimeout(() => {
        setIsAnimating(false);
      }, 700); // matches 700ms transition duration
    },
    [isAnimating, totalSlides]
  );

  const handleNext = useCallback(() => {
    goToSlide(safeIndex + 1);
  }, [safeIndex, goToSlide]);

  const handlePrev = useCallback(() => {
    goToSlide(safeIndex - 1);
  }, [safeIndex, goToSlide]);

  // Autoplay management (5000ms interval)
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
  }, [safeIndex, isPaused, totalSlides, handleNext]);

  // Pause when browser tab becomes inactive
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPaused(document.visibilityState === 'hidden');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Keyboard navigation support
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  if (!currentProject) {
    return null;
  }

  const hasLiveDemo = Boolean(
    currentProject.workingUrl &&
      currentProject.workingUrl !== '#' &&
      currentProject.workingUrl.startsWith('http') &&
      currentProject.isValidWebUrl !== false
  );

  const hasGithub = Boolean(
    currentProject.githubUrl &&
      currentProject.githubUrl !== '#' &&
      currentProject.githubUrl.startsWith('http')
  );

  const formattedSlideNum = String(safeIndex + 1).padStart(2, '0');
  const formattedTotal = String(totalSlides).padStart(2, '0');

  // Category badge color
  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'ai projects':
        return 'bg-[#2563EB]/25 text-[#38BDF8] border-[#2563EB]/40';
      case 'cybersecurity':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/35';
      case 'web development':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/35';
      default:
        return 'bg-[#243650] text-[#DCE6F5] border-[#243650]';
    }
  };

  const resolveStudent = (studentId: string, name: string): StudentProfile | undefined => {
    if (students && students.length > 0) {
      const match = students.find((s) => s.id === studentId || s.name.toLowerCase() === name.toLowerCase());
      if (match) return match;
    }
    return getStudentById(studentId);
  };

  const ambientThumbnail = currentProject.thumbnailUrl || currentProject.thumbnailAsset;

  return (
    <section
      aria-label="Featured Projects Banner Slideshow"
      className="relative select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Top Section Tag */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8]">
            FEATURED_INNOVATIONS // CINEMATIC_SHOWCASE
          </h2>
        </div>

        {/* Slide Counter in Header */}
        <div className="text-xs font-mono text-[#9FB0C8] flex items-center gap-1.5">
          <span className="text-[#38BDF8] font-bold">{formattedSlideNum}</span>
          <span>/</span>
          <span>{formattedTotal}</span>
        </div>
      </div>

      {/* Main Cinematic Banner Card */}
      <div
        ref={bannerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-full rounded-3xl overflow-hidden bg-[#101D35] border border-[#243650] shadow-[0_20px_50px_rgba(8,13,24,0.9),0_0_35px_rgba(37,99,235,0.15)] transition-all duration-300 group"
      >
        {/* Ambient Blurred Artwork Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {ambientThumbnail && (
            <img
              key={`ambient-${currentProject.id}`}
              src={ambientThumbnail}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover filter blur-3xl opacity-20 scale-125 transition-opacity duration-700"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-[#080D18] via-[#101D35]/95 to-[#101D35]/60" />
          <div className="absolute inset-0 bg-[#080D18]/40" />
        </div>

        {/* Content Layout: Split Grid on Desktop/Tablet, Stacked on Mobile */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 min-h-[380px] lg:min-h-[440px]">
          {/* LEFT COLUMN: Project Details & Meta */}
          <div className="md:col-span-6 flex flex-col justify-between p-6 sm:p-7 md:p-8 lg:p-10 order-2 md:order-1">
            {/* Upper Metadata */}
            <div className="space-y-4">
              {/* Badges & Slide Number Row */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border shadow-sm backdrop-blur-md ${getCategoryColor(
                    currentProject.category
                  )}`}
                >
                  {currentProject.category}
                </span>

                {currentProject.isCollaborative && (
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 flex items-center gap-1.5 shadow-sm">
                    <Users size={12} />
                    <span>Collaborative Team</span>
                  </span>
                )}

                <span className="ml-auto text-xs font-mono text-[#9FB0C8]/60 hidden sm:inline-block">
                  SLIDE {formattedSlideNum} OF {formattedTotal}
                </span>
              </div>

              {/* Title & Tagline */}
              <div className="space-y-2">
                <h3
                  onClick={() => onSelectProject(currentProject)}
                  className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#DCE6F5] tracking-tight leading-tight hover:text-[#38BDF8] transition-colors cursor-pointer"
                >
                  {currentProject.title}
                </h3>
                <p className="text-sm font-medium text-[#38BDF8] font-mono tracking-wide">
                  {currentProject.tagline}
                </p>
              </div>

              {/* Description Preview */}
              <p className="text-xs sm:text-sm text-[#9FB0C8] leading-relaxed line-clamp-3 sm:line-clamp-4">
                {currentProject.description}
              </p>

              {/* Contributor Row */}
              <div className="pt-2 flex items-center gap-3">
                <div className="flex -space-x-2 overflow-hidden">
                  {currentProject.contributors.map((name) => {
                    const initials = name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <div
                        key={name}
                        title={`Student Builder: ${name}`}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#101D35] to-[#2563EB] border-2 border-[#101D35] flex items-center justify-center text-[10px] font-mono font-bold text-[#DCE6F5] shadow-sm"
                      >
                        {initials}
                      </div>
                    );
                  })}
                </div>

                <div className="text-xs text-[#9FB0C8]">
                  <span className="text-[#9FB0C8]/70 block font-mono text-[10px] uppercase tracking-wider">
                    {currentProject.isCollaborative ? 'Co-Engineered By' : 'Lead Builder'}
                  </span>
                  <div className="flex flex-wrap gap-1 font-semibold text-[#DCE6F5]">
                    {currentProject.contributors.map((name, idx) => {
                      const studentId = currentProject.contributorIds[idx];
                      const student = resolveStudent(studentId, name);

                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (student && onSelectStudent) {
                              onSelectStudent(student);
                            }
                          }}
                          className={`${
                            student && onSelectStudent
                              ? 'hover:text-[#38BDF8] hover:underline cursor-pointer'
                              : ''
                          }`}
                        >
                          {name}
                          {idx < currentProject.contributors.length - 1 ? ',' : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="pt-5 sm:pt-6 md:pt-8 flex flex-wrap items-center gap-2.5 sm:gap-3">
              {/* Explore Project Action Button (Disabled if no public demo URL exists) */}
              {hasLiveDemo ? (
                <button
                  type="button"
                  onClick={() => onSelectProject(currentProject)}
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-mono text-xs sm:text-sm font-bold flex items-center gap-2 border border-[#38BDF8]/60 shadow-lg shadow-[#2563EB]/30 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Eye size={15} />
                  <span>Explore Project</span>
                  <ArrowRight size={14} className="ml-0.5" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  title="Explore Project is disabled because no public demo URL was provided for this submission"
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#101D35] text-[#9FB0C8]/50 font-mono text-xs sm:text-sm font-bold flex items-center gap-2 border border-[#243650] cursor-not-allowed opacity-60 select-none"
                >
                  <Lock size={14} />
                  <span>Explore Project</span>
                </button>
              )}

              {/* Live Demo Button */}
              {hasLiveDemo ? (
                <a
                  href={currentProject.workingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#080D18]/90 hover:bg-[#172945] border border-[#243650] hover:border-[#38BDF8] text-[#DCE6F5] font-mono text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all shadow-sm"
                  title="Launch Live Project"
                >
                  <span>Live Demo</span>
                  <ExternalLink size={13} className="text-[#38BDF8]" />
                </a>
              ) : (
                <span
                  title="No public live demo URL available"
                  className="px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#080D18]/50 border border-[#243650]/40 text-[#9FB0C8]/40 font-mono text-xs sm:text-sm flex items-center gap-1.5 cursor-not-allowed select-none"
                >
                  <span>Demo Unavailable</span>
                </span>
              )}

              {currentProject.secondaryUrl && (
                <a
                  href={currentProject.secondaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#080D18]/90 hover:bg-[#172945] border border-[#243650] hover:border-[#38BDF8] text-[#DCE6F5] font-mono text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all shadow-sm"
                  title={currentProject.secondaryUrlLabel || 'Secondary Link'}
                >
                  <Smartphone size={14} className="text-[#38BDF8]" />
                  <span>{currentProject.secondaryUrlLabel || 'App'}</span>
                </a>
              )}

              {hasGithub && (
                <a
                  href={currentProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 sm:p-3 rounded-xl bg-[#080D18]/90 hover:bg-[#172945] border border-[#243650] hover:border-[#38BDF8] text-[#DCE6F5] transition-all shadow-sm flex items-center justify-center"
                  title="View GitHub Repository"
                >
                  <GithubIcon size={16} />
                </a>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Large Cinematic Artwork Stage */}
          <div
            onClick={() => onSelectProject(currentProject)}
            className="md:col-span-6 relative p-4 sm:p-5 md:p-6 lg:p-8 flex items-center justify-center order-1 md:order-2 cursor-pointer"
          >
            {/* Artwork Frame: Centered navy background, rounded corners, subtle border */}
            <div className="relative w-full h-[220px] sm:h-[260px] md:h-[300px] lg:h-[380px] rounded-2xl overflow-hidden bg-[#080D18] border border-[#243650] shadow-2xl flex items-center justify-center group-hover:border-[#38BDF8]/50 transition-colors">
              <ProjectThumbnail
                key={currentProject.id}
                project={currentProject}
                aspectRatio="h-full w-full"
                objectFit="contain"
                imageClassName="p-2 sm:p-3"
              />

              {/* Hover inspect badge */}
              <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-[#080D18]/85 border border-[#243650] text-[#38BDF8] text-[11px] font-mono font-medium flex items-center gap-1.5 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <Eye size={12} />
                <span>Click to view details</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM NAVIGATION STRIP: Arrows & Progress Dots */}
        <div className="relative z-20 px-6 sm:px-8 py-3.5 bg-[#080D18]/90 border-t border-[#243650] flex items-center justify-between gap-4">
          {/* Arrow Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous project slide"
              className="w-8 h-8 rounded-lg bg-[#101D35] hover:bg-[#2563EB] border border-[#243650] hover:border-[#38BDF8] text-[#9FB0C8] hover:text-white flex items-center justify-center transition-all focus:outline-none focus:ring-1 focus:ring-[#38BDF8] cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next project slide"
              className="w-8 h-8 rounded-lg bg-[#101D35] hover:bg-[#2563EB] border border-[#243650] hover:border-[#38BDF8] text-[#9FB0C8] hover:text-white flex items-center justify-center transition-all focus:outline-none focus:ring-1 focus:ring-[#38BDF8] cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Clickable Progress Indicators (All 27 Unique Projects) */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-[50%] sm:max-w-[70%] py-1">
            {projects.map((proj, idx) => {
              const isActive = idx === safeIndex;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={`Jump to slide ${idx + 1}: ${proj.title}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer shrink-0 ${
                    isActive
                      ? 'w-6 sm:w-7 h-2 bg-gradient-to-r from-[#38BDF8] to-[#2563EB] shadow-[0_0_10px_rgba(56,189,248,0.5)]'
                      : 'w-2 h-2 bg-[#243650] hover:bg-[#9FB0C8]/60'
                  }`}
                />
              );
            })}
          </div>

          {/* Autoplay Status Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-[#9FB0C8]/70">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
              }`}
            />
            <span>{isPaused ? 'PAUSED' : 'AUTOPLAY (5s)'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
