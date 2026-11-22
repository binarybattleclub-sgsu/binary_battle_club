import React, { useState } from 'react';
import { Film, Flame, ListVideo } from 'lucide-react';

interface VideoThumbnailProps {
  primarySrc?: string | null;
  fallbackSrc?: string | null;
  alt: string;
  contentType?: 'video' | 'short' | 'playlist';
  aspect?: 'video' | 'short';
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  primarySrc,
  fallbackSrc,
  alt,
  contentType = 'video',
  aspect = 'video',
  className = '',
  onClick,
  children,
}) => {
  // Current active source: starts with primary, then falls back to secondary
  const [activeSrc, setActiveSrc] = useState<string | null>(primarySrc || fallbackSrc || null);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(primarySrc || fallbackSrc));
  const [hasError, setHasError] = useState<boolean>(!primarySrc && !fallbackSrc);

  const handleError = () => {
    // If the primary image failed and we have an untried fallback, try fallback
    if (activeSrc === primarySrc && fallbackSrc && fallbackSrc !== primarySrc) {
      setActiveSrc(fallbackSrc);
      setIsLoading(true);
    } else {
      // Both failed or no fallback available -> show controlled navy placeholder
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const isShort = aspect === 'short' || contentType === 'short';

  return (
    <div
      onClick={onClick}
      className={`relative w-full ${
        isShort ? 'aspect-[9/16]' : 'aspect-video'
      } overflow-hidden bg-[#080D18] cursor-pointer group ${className}`}
    >
      {/* 1. Loading Skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#101D35] animate-pulse flex items-center justify-center z-0">
          <div className="w-8 h-8 rounded-full border-2 border-[#38BDF8]/20 border-t-[#38BDF8] animate-spin" />
        </div>
      )}

      {/* 2. Image Element */}
      {!hasError && activeSrc ? (
        <img
          src={activeSrc}
          alt={alt}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
        />
      ) : (
        /* 3. Controlled Midnight Navy Fallback (No broken browser icon) */
        <div className="absolute inset-0 bg-gradient-to-br from-[#101D35] via-[#0d1829] to-[#080D18] flex flex-col items-center justify-center p-4 text-center select-none">
          <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/15 border border-[#38BDF8]/25 flex items-center justify-center text-[#38BDF8] shadow-inner mb-2">
            {contentType === 'playlist' ? (
              <ListVideo size={22} className="text-[#38BDF8]" />
            ) : contentType === 'short' ? (
              <Flame size={22} className="text-red-400" />
            ) : (
              <Film size={22} className="text-[#38BDF8]" />
            )}
          </div>
          <p className="text-[11px] font-mono text-[#9FB0C8]/80 line-clamp-2 max-w-[85%] font-medium">
            {alt}
          </p>
        </div>
      )}

      {/* 4. Child Overlays (Play button, badges, gradient) */}
      {children}
    </div>
  );
};
