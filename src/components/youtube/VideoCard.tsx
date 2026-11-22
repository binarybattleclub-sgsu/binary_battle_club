import React from 'react';
import {
  Play,
  Star,
  ExternalLink,
  Film,
} from 'lucide-react';
import { YouTubeIcon } from './YouTubeIcon';
import { YouTubeVideo } from '../../types/youtube';
import { getYouTubeExternalUrl } from '../../services/youtubeService';

interface VideoCardProps {
  video: YouTubeVideo;
  onPlay: (video: YouTubeVideo) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onPlay,
}) => {
  const externalUrl = getYouTubeExternalUrl(video);

  return (
    <div className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#101D35]/85 backdrop-blur-xl border border-[#243650] hover:border-[#38BDF8]/50 hover:bg-[#172945]/90 shadow-[0_12px_35px_rgba(8,13,24,0.8)] hover:shadow-[0_16px_40px_rgba(8,13,24,0.95),0_0_25px_rgba(37,99,235,0.2)] transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* 16:9 Thumbnail Container */}
        <div
          onClick={() => onPlay(video)}
          className="relative w-full aspect-video overflow-hidden bg-[#080D18] cursor-pointer"
        >
          <img
            src={video.customThumbnailUrl || video.thumbnailUrl}
            alt={video.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('hqdefault') && video.youtubeId) {
                target.src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
              }
            }}
          />

          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080D18]/90 via-[#080D18]/30 to-transparent pointer-events-none" />

          {/* Category Badge (Top Left) */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#080D18]/85 backdrop-blur-md border border-[#243650] text-[10px] font-mono font-semibold text-[#38BDF8] flex items-center gap-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
            <span>{video.category}</span>
          </div>

          {/* Top Right Badges */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {video.isFeatured && (
              <div className="px-2 py-1 rounded-full bg-[#2563EB]/90 backdrop-blur-md border border-[#38BDF8]/40 text-[9px] font-mono font-semibold text-white flex items-center gap-1 shadow-md">
                <Star size={10} className="fill-amber-300 text-amber-300" />
                <span>FEATURED</span>
              </div>
            )}
            <div className="px-2 py-1 rounded-full bg-[#080D18]/85 backdrop-blur-md border border-[#243650] text-[9px] font-mono font-semibold text-[#9FB0C8] flex items-center gap-1">
              <Film size={11} className="text-[#38BDF8]" />
              <span>VIDEO</span>
            </div>
          </div>

          {/* Center Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-[#2563EB]/90 text-white flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.6)] border border-[#38BDF8]/60 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#2563EB]">
              <Play size={20} className="ml-1 fill-white" />
            </div>
          </div>

          {/* YouTube Branding Tag (Bottom Right) */}
          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#080D18]/85 backdrop-blur-md border border-[#243650] text-[10px] font-mono text-[#9FB0C8] flex items-center gap-1">
            <YouTubeIcon size={12} className="text-red-500" />
            <span>YouTube</span>
          </div>
        </div>

        {/* Video Card Content */}
        <div className="p-5 space-y-2.5">
          <h3
            onClick={() => onPlay(video)}
            className="text-sm sm:text-base font-bold text-[#DCE6F5] group-hover:text-[#38BDF8] transition-colors leading-snug line-clamp-2 cursor-pointer"
          >
            {video.title}
          </h3>

          <p className="text-xs text-[#9FB0C8] line-clamp-2 leading-relaxed">
            {video.description ||
              'Technical tutorial and practical walkthrough curated by Binary Battle Club.'}
          </p>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="px-5 pb-5 pt-1 space-y-3">
        <div className="flex items-center justify-between text-xs pt-2 border-t border-[#243650]/50">
          <button
            onClick={() => onPlay(video)}
            className="btn-primary w-full py-2 text-xs flex items-center justify-center gap-2"
          >
            <Play size={14} className="fill-white" />
            <span>Watch Video</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-[#9FB0C8]/70">
          <span className="flex items-center gap-1">
            <YouTubeIcon size={12} className="text-red-500" />
            <span>Tutorial</span>
          </span>

          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#9FB0C8] hover:text-[#38BDF8] transition-colors"
            title="Open on YouTube"
          >
            <span>Open on YouTube</span>
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </div>
  );
};
