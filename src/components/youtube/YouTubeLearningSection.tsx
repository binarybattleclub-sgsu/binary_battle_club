import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  X,
  Film,
  Flame,
  ListVideo,
  Sparkles,
  RefreshCw,
  Layers,
  AlertCircle,
} from 'lucide-react';
import { YouTubeIcon } from './YouTubeIcon';
import {
  YouTubeVideo,
  ContentTypeFilter,
  DEFAULT_CATEGORIES,
} from '../../types/youtube';
import { fetchYouTubeLearningContent } from '../../services/youtubeService';
import { VideoCard } from './VideoCard';
import { ShortCard } from './ShortCard';
import { PlaylistCard } from './PlaylistCard';
import { FeaturedVideoCard } from './FeaturedVideoCard';
import { YouTubePlayerModal } from './YouTubePlayerModal';

export const YouTubeLearningSection: React.FC = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // Browsing filters state
  const [contentTypeFilter, setContentTypeFilter] = useState<ContentTypeFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active player modal
  const [playingVideo, setPlayingVideo] = useState<YouTubeVideo | null>(null);

  // Fetch live video data from Google Sheets backend
  const loadContent = useCallback(async (isInitial = false) => {
    if (isInitial) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setError(null);

    try {
      const items = await fetchYouTubeLearningContent();
      setVideos(items);
      setLastSynced(new Date());
    } catch (err: any) {
      console.warn('[YouTubeLearningSection] Sync warning:', err.message);
      if (isInitial) {
        setError(err.message || 'Unable to sync video library at this time.');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load and auto-sync triggers (every 60s + window focus + visibilitychange)
  useEffect(() => {
    loadContent(true);

    // Auto-refresh interval (every 60 seconds)
    const intervalId = setInterval(() => {
      loadContent(false);
    }, 60000);

    // Re-fetch on window focus / visibility change
    const handleFocus = () => {
      loadContent(false);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadContent(false);
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadContent]);

  // Compute available categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>(['All']);
    DEFAULT_CATEGORIES.forEach((cat) => set.add(cat));
    videos.forEach((v) => {
      if (v.category) set.add(v.category);
    });
    return Array.from(set);
  }, [videos]);

  // Filtered list based on published status, content type, category, and search query
  const visibleVideos = useMemo(() => {
    return videos.filter((video) => {
      // Only show published items to users
      if (!video.isPublished) return false;

      // Content-type filter
      if (contentTypeFilter !== 'all' && video.contentType !== contentTypeFilter) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && video.category !== selectedCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = video.title.toLowerCase().includes(query);
        const matchesDesc = (video.description || '').toLowerCase().includes(query);
        const matchesCat = (video.category || '').toLowerCase().includes(query);
        return matchesTitle || matchesDesc || matchesCat;
      }

      return true;
    });
  }, [videos, contentTypeFilter, selectedCategory, searchQuery]);

  // Item counts for filter tabs
  const counts = useMemo(() => {
    const published = videos.filter((v) => v.isPublished);
    return {
      all: published.length,
      video: published.filter((v) => v.contentType === 'video').length,
      short: published.filter((v) => v.contentType === 'short').length,
      playlist: published.filter((v) => v.contentType === 'playlist').length,
    };
  }, [videos]);

  // Featured highlight item (first item marked isFeatured, or null)
  const featuredItem = useMemo(() => {
    const published = visibleVideos.filter((v) => v.isPublished);
    return published.find((v) => v.isFeatured) || null;
  }, [visibleVideos]);

  // Items remaining for grid (excluding the featured card if shown at top)
  const gridVideos = useMemo(() => {
    if (!featuredItem) return visibleVideos;
    // When filtering by specific category or search, keep featured item in the list or separate
    return visibleVideos.filter((v) => v.id !== featuredItem.id);
  }, [visibleVideos, featuredItem]);

  // Helper to render card component based on content type
  const renderCard = (item: YouTubeVideo) => {
    if (item.contentType === 'short') {
      return (
        <ShortCard
          key={item.id}
          shortItem={item}
          onPlay={() => setPlayingVideo(item)}
        />
      );
    }

    if (item.contentType === 'playlist') {
      return (
        <PlaylistCard
          key={item.id}
          playlistItem={item}
          onPlay={() => setPlayingVideo(item)}
        />
      );
    }

    return (
      <VideoCard
        key={item.id}
        video={item}
        onPlay={() => setPlayingVideo(item)}
      />
    );
  };

  return (
    <section className="space-y-8">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#101D35] via-[#13223d] to-[#101D35] rounded-3xl p-6 sm:p-10 border border-[#243650] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#2563EB]/15 text-[#38BDF8] border border-[#2563EB]/30 shadow-sm">
              <YouTubeIcon size={14} className="text-red-500" />
              <span>YOUTUBE_LEARNING // VIDEO_LIBRARY</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#DCE6F5] tracking-tight">
              YouTube Learning
            </h2>

            <p className="text-xs sm:text-sm text-[#9FB0C8] leading-relaxed font-normal">
              Learn at your own pace. Explore practical tutorials, technical walkthroughs and learning resources curated by Binary Battle Club.
            </p>
          </div>

          {/* Sync Status Badge & Manual Refresh */}
          <div className="flex items-center gap-3 self-start md:self-center">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#080D18]/80 border border-[#243650] text-xs font-mono text-[#9FB0C8] shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>LIVE SYNC</span>
            </div>

            <button
              onClick={() => loadContent(false)}
              disabled={isRefreshing || isLoading}
              title="Refresh learning content from Google Sheets"
              className="p-2 rounded-xl bg-[#080D18]/80 hover:bg-[#172945] border border-[#243650] hover:border-[#38BDF8] text-[#9FB0C8] hover:text-[#38BDF8] transition-all disabled:opacity-50"
            >
              <RefreshCw size={15} className={isRefreshing ? 'animate-spin text-[#38BDF8]' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Filter & Search Controls */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Content Type Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setContentTypeFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 ${
                contentTypeFilter === 'all'
                  ? 'bg-[#2563EB] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-[#38BDF8]/50'
                  : 'bg-[#101D35]/70 text-[#9FB0C8] hover:text-[#DCE6F5] hover:bg-[#101D35] border border-[#243650]'
              }`}
            >
              <Sparkles size={14} />
              <span>All Types</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 text-[#DCE6F5]">
                {counts.all}
              </span>
            </button>

            <button
              onClick={() => setContentTypeFilter('video')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 ${
                contentTypeFilter === 'video'
                  ? 'bg-[#2563EB] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-[#38BDF8]/50'
                  : 'bg-[#101D35]/70 text-[#9FB0C8] hover:text-[#DCE6F5] hover:bg-[#101D35] border border-[#243650]'
              }`}
            >
              <Film size={14} />
              <span>Videos</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 text-[#DCE6F5]">
                {counts.video}
              </span>
            </button>

            <button
              onClick={() => setContentTypeFilter('short')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 ${
                contentTypeFilter === 'short'
                  ? 'bg-[#2563EB] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-[#38BDF8]/50'
                  : 'bg-[#101D35]/70 text-[#9FB0C8] hover:text-[#DCE6F5] hover:bg-[#101D35] border border-[#243650]'
              }`}
            >
              <Flame size={14} className="text-red-400" />
              <span>Shorts</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 text-[#DCE6F5]">
                {counts.short}
              </span>
            </button>

            <button
              onClick={() => setContentTypeFilter('playlist')}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-2 ${
                contentTypeFilter === 'playlist'
                  ? 'bg-[#2563EB] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-[#38BDF8]/50'
                  : 'bg-[#101D35]/70 text-[#9FB0C8] hover:text-[#DCE6F5] hover:bg-[#101D35] border border-[#243650]'
              }`}
            >
              <ListVideo size={14} className="text-[#38BDF8]" />
              <span>Playlists</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 text-[#DCE6F5]">
                {counts.playlist}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9FB0C8]/60 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search tutorials, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-[#101D35]/80 border border-[#243650] text-[#DCE6F5] placeholder-[#9FB0C8]/50 text-xs focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9FB0C8] hover:text-[#DCE6F5]"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40 font-semibold'
                  : 'bg-[#080D18]/70 text-[#9FB0C8] hover:text-[#DCE6F5] border border-[#243650]/80 hover:border-[#243650]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Featured Highlight Banner (if available and matches filters) */}
      {featuredItem && !searchQuery && (
        <FeaturedVideoCard
          video={featuredItem}
          onPlay={() => setPlayingVideo(featuredItem)}
        />
      )}

      {/* 4. Main Content Area */}
      {isLoading ? (
        /* Loading Skeleton */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-3xl bg-[#101D35]/50 border border-[#243650] p-4 space-y-4 animate-pulse"
            >
              <div className="aspect-video w-full rounded-2xl bg-[#080D18]" />
              <div className="space-y-2">
                <div className="h-4 bg-[#243650] rounded w-3/4" />
                <div className="h-3 bg-[#243650]/60 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : error && videos.length === 0 ? (
        /* Error State */
        <div className="p-8 sm:p-12 text-center rounded-3xl bg-[#101D35]/60 border border-red-500/30 space-y-4">
          <AlertCircle size={40} className="mx-auto text-red-400" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#DCE6F5]">Unable to Load Library</h3>
            <p className="text-xs sm:text-sm text-[#9FB0C8] max-w-md mx-auto">{error}</p>
          </div>
          <button
            onClick={() => loadContent(true)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <RefreshCw size={14} />
            <span>Try Again</span>
          </button>
        </div>
      ) : visibleVideos.length === 0 ? (
        /* Empty State */
        <div className="p-10 sm:p-16 text-center rounded-3xl bg-gradient-to-b from-[#101D35]/70 to-[#080D18]/90 border border-[#243650] space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center mx-auto text-[#38BDF8]">
            {contentTypeFilter === 'short' ? (
              <Flame size={28} className="text-red-400" />
            ) : contentTypeFilter === 'playlist' ? (
              <ListVideo size={28} />
            ) : (
              <Film size={28} />
            )}
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-[#DCE6F5]">
              Learning Content Coming Soon
            </h3>
            <p className="text-xs sm:text-sm text-[#9FB0C8] leading-relaxed">
              {searchQuery || selectedCategory !== 'All'
                ? 'No learning items matched your current filters. Try selecting a different category or clearing search terms.'
                : 'Curated programming walkthroughs, algorithm explanations, and workshop recordings will be published here directly from our YouTube channel.'}
            </p>
          </div>

          {(searchQuery || selectedCategory !== 'All' || contentTypeFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setContentTypeFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-[#2563EB]/20 hover:bg-[#2563EB]/30 border border-[#2563EB]/40 text-[#38BDF8] text-xs font-mono transition-all"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : contentTypeFilter === 'short' ? (
        /* Dense Portrait Grid for YouTube Shorts */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {visibleVideos.map((item) => renderCard(item))}
        </div>
      ) : (
        /* Standard 16:9 Grid for Videos & Playlists */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridVideos.map((item) => renderCard(item))}
        </div>
      )}

      {/* 5. Player Modal */}
      {playingVideo && (
        <YouTubePlayerModal
          video={playingVideo}
          onClose={() => setPlayingVideo(null)}
        />
      )}
    </section>
  );
};
