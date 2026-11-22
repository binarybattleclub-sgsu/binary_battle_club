import React from 'react';
import {
  Play,
  Star,
  ExternalLink,
  Flame,
} from 'lucide-react';
import { YouTubeIcon } from './YouTubeIcon';
import { YouTubeVideo } from '../../types/youtube';
import { parseYouTubeUrl } from '../../services/youtubeService';
import { VideoThumbnail } from './VideoThumbnail';

interface ShortCardProps {
  shortItem: YouTubeVideo;
  onPlay: (item: YouTubeVideo) => void;
}

export const ShortCard: React.FC<ShortCardProps> = ({
  shortItem,
  onPlay,
}) => {
  const parsed = shortItem.parsedUrl || parseYouTubeUrl(shortItem.youtubeUrl);
  const externalUrl = parsed.externalUrl || shortItem.youtubeUrl;
  const hasExternalUrl = Boolean(externalUrl && externalUrl.startsWith('http'));

  const primaryThumb = shortItem.customThumbnailUrl || shortItem.thumbnailUrl;
  const fallbackThumb = shortItem.fallbackThumbnailUrl || parsed.thumbnailFallbackUrl;

  return (
    <div className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#101D35]/85 backdrop-blur-xl border border-[#243650] hover:border-[#38BDF8]/60 hover:bg-[#172945]/90 shadow-[0_12px_35px_rgba(8,13,24,0.8)] hover:shadow-[0_16px_40px_rgba(8,13,24,0.95),0_0_25px_rgba(56,189,248,0.25)] transition-all duration-300 flex flex-col">
      {/* 9:16 Portrait Thumbnail Container */}
      <VideoThumbnail
        primarySrc={primaryThumb}
        fallbackSrc={fallbackThumb}
        alt={shortItem.title}
        contentType="short"
        aspect="short"
        onClick={() => onPlay(shortItem)}
      >
        {/* Gradient Overlay for Portrait readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080D18] via-[#080D18]/30 to-black/40 pointer-events-none" />

        {/* Top Badges: Shorts badge & Category */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
          <div className="px-2.5 py-1 rounded-full bg-red-600/90 backdrop-blur-md text-white text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
            <Flame size={12} className="fill-white" />
            <span>Shorts</span>
          </div>

          {shortItem.isFeatured && (
            <div className="px-2 py-1 rounded-full bg-[#2563EB]/90 backdrop-blur-md border border-[#38BDF8]/40 text-[9px] font-mono font-semibold text-white flex items-center gap-1 shadow-md">
              <Star size={10} className="fill-amber-300 text-amber-300" />
              <span>FEATURED</span>
            </div>
          )}
        </div>

        {/* Center Play Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-12 h-12 rounded-full bg-[#2563EB]/90 text-white flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.7)] border border-[#38BDF8]/70 transition-all duration-300 group-hover:scale-115 group-hover:bg-[#2563EB]">
            <Play size={20} className="ml-1 fill-white" />
          </div>
        </div>

        {/* Bottom Content within the portrait preview */}
        <div className="absolute bottom-0 inset-x-0 p-4 space-y-1.5 pointer-events-auto z-10">
          <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-mono uppercase bg-[#2563EB]/25 text-[#38BDF8] border border-[#2563EB]/40 backdrop-blur-sm">
            {shortItem.category}
          </span>

          <h3
            onClick={() => onPlay(shortItem)}
            className="text-xs sm:text-sm font-bold text-[#DCE6F5] group-hover:text-[#38BDF8] transition-colors leading-snug line-clamp-2 cursor-pointer"
            title={shortItem.title}
          >
            {shortItem.title}
          </h3>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] font-mono text-[#9FB0C8]/80 flex items-center gap-1">
              <YouTubeIcon size={11} className="text-red-500" />
              <span>YouTube Short</span>
            </span>

            {hasExternalUrl && (
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded-md bg-[#080D18]/80 hover:bg-[#101D35] border border-[#243650] text-[#9FB0C8] hover:text-[#38BDF8] transition-colors"
                title="Watch on YouTube Shorts"
              >
                <ExternalLink size={11} />
              </a>
            )}
          </div>
        </div>
      </VideoThumbnail>
    </div>
  );
};
