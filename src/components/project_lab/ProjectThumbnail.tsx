import React, { useState, useEffect } from 'react';
import { Code2, Shield, Brain, Sparkles } from 'lucide-react';
import { ProjectLabItem } from '../../data/projectLabData';

interface ProjectThumbnailProps {
  project: ProjectLabItem;
  className?: string;
  imageClassName?: string;
  aspectRatio?: string;
  objectFit?: 'contain' | 'cover';
  showCategoryBadge?: boolean;
}

export const ProjectThumbnail: React.FC<ProjectThumbnailProps> = ({
  project,
  className = '',
  imageClassName = '',
  aspectRatio = 'aspect-[16/10]',
  objectFit = 'contain',
  showCategoryBadge = false,
}) => {
  const primaryUrl = project.thumbnailUrl || project.thumbnailAsset || '';

  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [activeSrc, setActiveSrc] = useState<string>('');
  const [fallbackAttempted, setFallbackAttempted] = useState<boolean>(false);

  // Reset state whenever the project or thumbnail URL changes
  useEffect(() => {
    const targetUrl = project.thumbnailUrl || project.thumbnailAsset || '';
    if (!targetUrl) {
      setStatus('error');
      setActiveSrc('');
      return;
    }

    setStatus('loading');
    setActiveSrc(targetUrl);
    setFallbackAttempted(false);
  }, [project.id, project.thumbnailUrl, project.thumbnailAsset]);

  const handleImageLoad = () => {
    setStatus('loaded');
  };

  const handleImageError = () => {
    // If the image failed on drive.google.com/thumbnail, attempt alternative lh3 endpoint
    if (!fallbackAttempted && activeSrc.includes('drive.google.com/thumbnail')) {
      const match = activeSrc.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        setFallbackAttempted(true);
        setActiveSrc(`https://lh3.googleusercontent.com/d/${match[1]}=w1600`);
        return;
      }
    }

    // If a local matched asset exists and wasn't tried yet
    if (
      project.thumbnailAsset &&
      project.thumbnailAsset !== activeSrc &&
      project.thumbnailAsset.startsWith('/images/')
    ) {
      setActiveSrc(project.thumbnailAsset);
      return;
    }

    // All endpoints failed or image is unavailable
    setStatus('error');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI Projects':
        return <Brain className="text-[#38BDF8]" size={28} />;
      case 'Cybersecurity':
        return <Shield className="text-emerald-400" size={28} />;
      case 'Web Development':
      default:
        return <Code2 className="text-[#60A5FA]" size={28} />;
    }
  };

  const getInitials = (title: string) => {
    const words = title.replace(/[^a-zA-Z0-9\s]/g, '').trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return title.slice(0, 2).toUpperCase();
  };

  return (
    <div
      className={`relative w-full ${aspectRatio} overflow-hidden bg-[#080D18] flex items-center justify-center ${className}`}
    >
      {/* 1. Loading Skeleton */}
      {status === 'loading' && (
        <div className="absolute inset-0 bg-[#080D18] flex flex-col items-center justify-center animate-pulse z-10">
          <div className="w-12 h-12 rounded-2xl bg-[#101D35] border border-[#243650] flex items-center justify-center shadow-inner">
            <Sparkles size={20} className="text-[#38BDF8] animate-spin" />
          </div>
          <span className="mt-3 text-[10px] font-mono uppercase tracking-wider text-[#9FB0C8]/70">
            Loading Artwork...
          </span>
        </div>
      )}

      {/* 2. Active Image (Hidden until loaded, then smoothly revealed) */}
      {activeSrc && status !== 'error' && (
        <img
          key={activeSrc}
          src={activeSrc}
          alt={project.title}
          loading="lazy"
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`w-full h-full ${
            objectFit === 'contain' ? 'object-contain' : 'object-cover'
          } transition-all duration-500 ease-out ${
            status === 'loaded' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } ${imageClassName}`}
        />
      )}

      {/* 3. Midnight Navy Cybernetic Fallback (Only shown when no URL exists or loading failed) */}
      {status === 'error' && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#101D35] via-[#0D1829] to-[#080D18] flex flex-col items-center justify-center p-6 text-center select-none border border-[#243650]/40">
          {/* Subtle grid pattern background */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #38BDF8 1px, transparent 0)`,
              backgroundSize: '16px 16px',
            }}
          />

          {/* Ambient Glow */}
          <div className="absolute w-24 h-24 bg-[#2563EB]/15 rounded-full blur-xl pointer-events-none" />

          {/* Icon Badge */}
          <div className="relative w-12 h-12 rounded-2xl bg-[#101D35] border border-[#2563EB]/40 flex items-center justify-center shadow-lg mb-2 group-hover:scale-105 transition-transform">
            {getCategoryIcon(project.category)}
          </div>

          {/* Initials & Category */}
          <span className="relative text-xs font-mono font-bold tracking-wider text-[#38BDF8] uppercase mb-1">
            {getInitials(project.title)} // {project.category}
          </span>
          <p className="relative text-xs text-[#9FB0C8] line-clamp-1 max-w-[85%] font-medium">
            {project.title}
          </p>
        </div>
      )}

      {/* Subtle bottom shadow vignette for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#101D35]/80 via-transparent to-black/20 pointer-events-none" />
    </div>
  );
};
