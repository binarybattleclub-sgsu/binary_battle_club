import React from 'react';
import {
  ListVideo,
  Play,
  Star,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { YouTubeIcon } from './YouTubeIcon';
import { YouTubeVideo } from '../../types/youtube';
import { parseYouTubeUrl } from '../../services/youtubeService';
import { VideoThumbnail } from './VideoThumbnail';

interface PlaylistCardProps {
  playlistItem: YouTubeVideo;
  onPlay: (item: YouTubeVideo) => void;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlistItem,
  onPlay,
}) => {
  const parsed = playlistItem.parsedUrl || parseYouTubeUrl(playlistItem.youtubeUrl);
  const externalUrl = parsed.externalUrl || playlistItem.youtubeUrl;
  const hasExternalUrl = Boolean(externalUrl && externalUrl.startsWith('http'));

  const primaryThumb = playlistItem.customThumbnailUrl || playlistItem.thumbnailUrl;
  const fallbackThumb = playlistItem.fallbackThumbnailUrl || parsed.thumbnailFallbackUrl;

  return (
    <div className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#101D35]/85 backdrop-blur-xl border border-[#243650] hover:border-[#38BDF8]/50 hover:bg-[#172945]/90 shadow-[0_12px_35px_rgba(8,13,24,0.8)] hover:shadow-[0_16px_40px_rgba(8,13,24,0.95),0_0_25px_rgba(37,99,235,0.2)] transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* 16:9 Thumbnail Cover with Stacked Playlist Visual Cue */}
        <VideoThumbnail
          primarySrc={primaryThumb}
          fallbackSrc={fallbackThumb}
          alt={playlistItem.title}
          contentType="playlist"
          aspect="video"
          onClick={() => onPlay(playlistItem)}
        >
          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080D18]/95 via-[#080D18]/40 to-transparent pointer-events-none" />

          {/* Top Left: Category Pill */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#080D18]/85 backdrop-blur-md border border-[#243650] text-[10px] font-mono font-semibold text-[#38BDF8] flex items-center gap-1.5 shadow-md z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
            <span>{playlistItem.category}</span>
          </div>

          {/* Top Right: Distinct Playlist Badge & Stack Indicator */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            {playlistItem.isFeatured && (
              <div className="px-2 py-1 rounded-full bg-[#2563EB]/90 backdrop-blur-md border border-[#38BDF8]/40 text-[9px] font-mono font-semibold text-white flex items-center gap-1 shadow-md">
                <Star size={10} className="fill-amber-300 text-amber-300" />
                <span>FEATURED</span>
              </div>
            )}
            <div className="px-2.5 py-1 rounded-full bg-[#2563EB]/90 backdrop-blur-md border border-[#38BDF8]/50 text-white text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
              <ListVideo size={13} className="text-[#38BDF8]" />
              <span>PLAYLIST</span>
            </div>
          </div>

          {/* Right Stack Overlay Bar (Simulating multi-video series) */}
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 bg-[#080D18]/75 backdrop-blur-sm border-l border-[#243650]/80 flex flex-col items-center justify-center gap-1 text-[#38BDF8] pointer-events-none group-hover:bg-[#2563EB]/30 transition-colors z-10">
            <Layers size={18} />
            <span className="text-[9px] font-mono font-bold uppercase tracking-tighter text-[#DCE6F5]">
              SERIES
            </span>
          </div>

          {/* Center Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="w-12 h-12 rounded-full bg-[#2563EB]/90 text-white flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.7)] border border-[#38BDF8]/70 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#2563EB]">
              <Play size={20} className="ml-1 fill-white" />
            </div>
          </div>
        </VideoThumbnail>

        {/* Card Body */}
        <div className="p-5 space-y-2.5">
          <h3
            onClick={() => onPlay(playlistItem)}
            className="text-sm sm:text-base font-bold text-[#DCE6F5] group-hover:text-[#38BDF8] transition-colors leading-snug line-clamp-2 cursor-pointer"
          >
            {playlistItem.title}
          </h3>

          <p className="text-xs text-[#9FB0C8] line-clamp-2 leading-relaxed">
            {playlistItem.description ||
              'Complete video playlist and learning curriculum curated by Binary Battle Club.'}
          </p>
        </div>
      </div>

      {/* Footer Bar & Watch Playlist Action */}
      <div className="px-5 pb-5 pt-1 space-y-3">
        <div className="flex items-center justify-between text-xs pt-2 border-t border-[#243650]/50">
          <button
            onClick={() => onPlay(playlistItem)}
            className="btn-primary w-full py-2 text-xs flex items-center justify-center gap-2"
          >
            <ListVideo size={14} className="text-[#38BDF8]" />
            <span>Watch Playlist</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-[#9FB0C8]/70">
          <span className="flex items-center gap-1">
            <YouTubeIcon size={12} className="text-red-500" />
            <span>Curated Series</span>
          </span>

          {hasExternalUrl && (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#9FB0C8] hover:text-[#38BDF8] transition-colors"
              title="Open playlist directly on YouTube"
            >
              <span>Open on YouTube</span>
              <ExternalLink size={11} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
