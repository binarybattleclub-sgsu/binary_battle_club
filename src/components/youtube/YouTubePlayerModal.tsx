import React, { useEffect } from 'react';
import { X, ExternalLink, AlertCircle, ListVideo, Flame, Film } from 'lucide-react';
import { YouTubeVideo } from '../../types/youtube';
import { getYouTubeEmbedUrl, getYouTubeExternalUrl } from '../../services/youtubeService';

interface YouTubePlayerModalProps {
  video: YouTubeVideo | null;
  onClose: () => void;
}

export const YouTubePlayerModal: React.FC<YouTubePlayerModalProps> = ({ video, onClose }) => {
  useEffect(() => {
    if (!video) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [video, onClose]);

  if (!video) return null;

  const embedUrl = getYouTubeEmbedUrl(video);
  const externalUrl = getYouTubeExternalUrl(video);
  const isShort = video.contentType === 'short';
  const isPlaylist = video.contentType === 'playlist';

  let typeLabel = 'Video';
  let badgeIcon = <Film size={12} className="text-[#38BDF8]" />;
  if (isPlaylist) {
    typeLabel = 'Playlist';
    badgeIcon = <ListVideo size={12} className="text-[#38BDF8]" />;
  } else if (isShort) {
    typeLabel = 'Shorts';
    badgeIcon = <Flame size={12} className="text-red-400" />;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="player-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#080D18]/90 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${
          isShort ? 'max-w-sm sm:max-w-md' : 'max-w-4xl'
        } bg-[#101D35] border border-[#243650] rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_rgba(8,13,24,0.95)] overflow-hidden flex flex-col transition-all max-h-[95vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-[#243650] bg-[#080D18]/70 text-[#DCE6F5]">
          <div className="flex items-center gap-2 min-w-0 pr-3">
            <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse shrink-0" />
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[#2563EB]/20 text-[#38BDF8] border border-[#2563EB]/30 shrink-0 flex items-center gap-1">
              {badgeIcon}
              <span>{typeLabel}</span>
            </span>
            <span className="text-[10px] font-mono text-[#9FB0C8] shrink-0 hidden sm:inline">
              // {video.category}
            </span>
            <h3
              id="player-modal-title"
              className="text-xs sm:text-sm font-semibold truncate text-[#DCE6F5]"
            >
              {video.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Fallback External Link */}
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-[#101D35] hover:bg-[#172945] border border-[#243650] hover:border-[#38BDF8] text-[#38BDF8] text-xs font-mono flex items-center gap-1.5 transition-colors"
              title="Watch directly on YouTube (if embedding is restricted)"
            >
              <ExternalLink size={13} />
              <span className="hidden sm:inline">YouTube</span>
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              aria-label="Close player"
              className="p-1.5 rounded-lg bg-[#101D35] hover:bg-[#172945] border border-[#243650] hover:border-[#38BDF8] text-[#9FB0C8] hover:text-[#DCE6F5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Video / Shorts / Playlist Player Container */}
        <div
          className={`relative w-full ${
            isShort ? 'aspect-[9/16] max-h-[70vh]' : 'aspect-video'
          } bg-[#080D18] flex items-center justify-center`}
        >
          <iframe
            src={embedUrl}
            title={video.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Details Bottom Bar */}
        <div className="p-3.5 sm:p-4 bg-[#101D35] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-[#9FB0C8]">
          <div className="space-y-0.5 max-w-xl">
            <p className="text-[#DCE6F5] font-medium line-clamp-1">
              {video.description || 'Curated learning resource by Binary Battle Club.'}
            </p>
            <p className="text-[11px] font-mono text-[#9FB0C8]/70">
              {isPlaylist ? (
                <>Playlist ID: <span className="text-[#38BDF8]">{video.playlistId || video.youtubeId}</span> • Multi-video series</>
              ) : (
                <>ID: <span className="text-[#38BDF8]">{video.youtubeId}</span> • Privacy-enhanced playback</>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <span className="text-[11px] font-mono text-[#9FB0C8]/80 flex items-center gap-1">
              <AlertCircle size={12} className="text-[#38BDF8]" />
              <span>Press <kbd className="px-1 py-0.5 rounded bg-[#080D18] border border-[#243650] text-[#DCE6F5]">Esc</kbd></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
