import React from 'react';
import {
  Play,
  Star,
  ExternalLink,
  ListVideo,
  Flame,
  Film,
} from 'lucide-react';
import { YouTubeIcon } from './YouTubeIcon';
import { YouTubeVideo } from '../../types/youtube';
import { parseYouTubeUrl } from '../../services/youtubeService';
import { VideoThumbnail } from './VideoThumbnail';

interface FeaturedVideoCardProps {
  video: YouTubeVideo;
  onPlay: (video: YouTubeVideo) => void;
}

export const FeaturedVideoCard: React.FC<FeaturedVideoCardProps> = ({
  video,
  onPlay,
}) => {
  const parsed = video.parsedUrl || parseYouTubeUrl(video.youtubeUrl);
  const externalUrl = parsed.externalUrl || video.youtubeUrl;
  const hasExternalUrl = Boolean(externalUrl && externalUrl.startsWith('http'));

  const primaryThumb = video.customThumbnailUrl || video.thumbnailUrl;
  const fallbackThumb = video.fallbackThumbnailUrl || parsed.thumbnailFallbackUrl;

  const isPlaylist = video.contentType === 'playlist';
  const isShort = video.contentType === 'short';

  let typeBadgeLabel = 'FEATURED TUTORIAL';
  let ctaLabel = 'Watch Video Now';
  let typeTag = 'YouTube Video';

  if (isPlaylist) {
    typeBadgeLabel = 'FEATURED PLAYLIST';
    ctaLabel = 'Watch Playlist Now';
    typeTag = 'Curated Series';
  } else if (isShort) {
    typeBadgeLabel = 'FEATURED SHORT';
    ctaLabel = 'Watch Short Now';
    typeTag = 'YouTube Short';
  }

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#101D35] via-[#12223d] to-[#080D18] border border-[#2563EB]/40 shadow-[0_20px_50px_rgba(8,13,24,0.9),0_0_30px_rgba(37,99,235,0.15)] p-5 sm:p-8">
      {/* Decorative Cyan Glow in background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
        {/* Left Column: Media Preview */}
        <div className="lg:col-span-7">
          <div className="group/thumb relative w-full aspect-video rounded-2xl overflow-hidden border border-[#243650] shadow-2xl bg-[#080D18]">
            <VideoThumbnail
              primarySrc={primaryThumb}
              fallbackSrc={fallbackThumb}
              alt={video.title}
              contentType={video.contentType}
              aspect="video"
              onClick={() => onPlay(video)}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080D18]/90 via-[#080D18]/30 to-transparent pointer-events-none" />

              {/* Glowing Big Play Button */}
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-[0_0_35px_rgba(37,99,235,0.8)] border-2 border-[#38BDF8] transition-transform duration-300 group-hover/thumb:scale-110">
                  {isPlaylist ? (
                    <ListVideo size={30} className="text-white" />
                  ) : (
                    <Play size={28} className="ml-1.5 fill-white text-white" />
                  )}
                </div>
              </div>

              {/* YouTube Tag (Bottom Right) */}
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-[#080D18]/85 backdrop-blur-md border border-[#243650] text-[11px] font-mono text-[#9FB0C8] flex items-center gap-1.5 shadow-md z-10">
                <YouTubeIcon size={14} className="text-red-500" />
                <span>{typeTag}</span>
              </div>

              {/* Featured Badge (Top Left) */}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#2563EB]/90 backdrop-blur-md border border-[#38BDF8]/50 text-xs font-mono font-bold text-white flex items-center gap-1.5 shadow-lg z-10">
                <Star size={13} className="fill-amber-300 text-amber-300" />
                <span>{typeBadgeLabel}</span>
              </div>
            </VideoThumbnail>
          </div>
        </div>

        {/* Right Column: Details & Actions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-[#2563EB]/15 text-[#38BDF8] border border-[#2563EB]/30">
              {video.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-[#9FB0C8] bg-[#080D18] border border-[#243650] flex items-center gap-1">
              {isPlaylist && <ListVideo size={12} className="text-[#38BDF8]" />}
              {isShort && <Flame size={12} className="text-red-400" />}
              {!isPlaylist && !isShort && <Film size={12} className="text-[#38BDF8]" />}
              <span>Curated by Binary Battle Club</span>
            </span>
          </div>

          <h3
            onClick={() => onPlay(video)}
            className="text-xl sm:text-2xl font-extrabold text-[#DCE6F5] hover:text-[#38BDF8] transition-colors leading-tight cursor-pointer"
          >
            {video.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#9FB0C8] leading-relaxed font-normal">
            {video.description ||
              (isPlaylist
                ? 'Complete learning series and structured curriculum curated by Binary Battle Club.'
                : 'Explore in-depth technical walkthroughs, project blueprints, and hands-on coding demonstrations curated by the club leaders.')}
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onPlay(video)}
              className="btn-primary"
            >
              {isPlaylist ? <ListVideo size={16} /> : <Play size={16} className="fill-white" />}
              <span>{ctaLabel}</span>
            </button>

            {hasExternalUrl && (
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <span>{isPlaylist ? 'Open Playlist' : 'YouTube'}</span>
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
