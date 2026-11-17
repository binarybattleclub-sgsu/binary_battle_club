import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  X,
  Lock,
  Unlock,
  ShieldCheck,
  Film,
  Flame,
  ListVideo,
  Sparkles,
  Filter,
  Download,
} from 'lucide-react';
import { YouTubeIcon } from './YouTubeIcon';
import {
  YouTubeVideo,
  YouTubeContentType,
  ContentTypeFilter,
  DEFAULT_CATEGORIES,
} from '../../types/youtube';
import {
  getStoredVideos,
  deleteVideo,
  toggleFeaturedVideo,
  togglePublishVideo,
  isAdminAuthenticated,
  adminLogout,
  exportVideosJson,
} from '../../services/youtubeService';
import { VideoCard } from './VideoCard';
import { ShortCard } from './ShortCard';
import { PlaylistCard } from './PlaylistCard';
import { FeaturedVideoCard } from './FeaturedVideoCard';
import { YouTubePlayerModal } from './YouTubePlayerModal';
import { VideoManagementModal } from './VideoManagementModal';
import { AdminAuthModal } from './AdminAuthModal';

export const YouTubeLearningSection: React.FC = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Browsing filters state
  const [contentTypeFilter, setContentTypeFilter] = useState<ContentTypeFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [playingVideo, setPlayingVideo] = useState<YouTubeVideo | null>(null);
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const [videoToEdit, setVideoToEdit] = useState<YouTubeVideo | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Load videos and auth state
  const reloadVideos = () => {
    setVideos(getStoredVideos());
  };

  useEffect(() => {
    reloadVideos();
    const authenticated = isAdminAuthenticated();
    setIsAdmin(authenticated);

    // Support deep-linking to open the admin passcode modal
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('admin') === 'open') {
        setIsAuthModalOpen(true);
      }
    }

    const handleVideosUpdated = () => reloadVideos();
    const handleAuthChanged = () => setIsAdmin(isAdminAuthenticated());

    window.addEventListener('bbc-videos-updated', handleVideosUpdated);
    window.addEventListener('bbc-admin-auth-changed', handleAuthChanged);

    return () => {
      window.removeEventListener('bbc-videos-updated', handleVideosUpdated);
      window.removeEventListener('bbc-admin-auth-changed', handleAuthChanged);
    };
  }, []);

  // Compute available categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>(['All']);
    DEFAULT_CATEGORIES.forEach((cat) => set.add(cat));
    videos.forEach((v) => {
      if (v.category) set.add(v.category);
    });
    return Array.from(set);
  }, [videos]);

  // Filtered list based on authentication, content type, category, and search query
  const visibleVideos = useMemo(() => {
    return videos.filter((video) => {
      // Ordinary visitors only see published content; admins see drafts too
      if (!isAdmin && !video.isPublished) return false;

      // Content-type filter
      if (contentTypeFilter !== 'all' && video.contentType !== contentTypeFilter) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && video.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = video.title.toLowerCase().includes(query);
        const matchesDesc = (video.description || '').toLowerCase().includes(query);
        const matchesCat = (video.category || '').toLowerCase().includes(query);
        return matchesTitle || matchesDesc || matchesCat;
      }

      return true;
    });
  }, [videos, isAdmin, contentTypeFilter, selectedCategory, searchQuery]);

  // Item counts for filter tabs
  const counts = useMemo(() => {
    const baseList = videos.filter((v) => (isAdmin ? true : v.isPublished));
    return {
      all: baseList.length,
      video: baseList.filter((v) => v.contentType === 'video').length,
      short: baseList.filter((v) => v.contentType === 'short').length,
      playlist: baseList.filter((v) => v.contentType === 'playlist').length,
    };
  }, [videos, isAdmin]);

  // Featured item: highest priority is isFeatured and published
  const featuredItem = useMemo(() => {
    const published = visibleVideos.filter((v) => v.isPublished);
    const featured = published.find((v) => v.isFeatured);
    return featured || null;
  }, [visibleVideos]);

  // Handlers
  const handleOpenAddContent = () => {
    setVideoToEdit(null);
    setIsManagementOpen(true);
  };

  const handleEditContent = (item: YouTubeVideo) => {
    setVideoToEdit(item);
    setIsManagementOpen(true);
  };

  const handleDeleteContent = (item: YouTubeVideo) => {
    if (window.confirm(`Are you sure you want to remove "${item.title}" from the library?`)) {
      deleteVideo(item.id);
    }
  };

  const handleToggleFeatured = (item: YouTubeVideo) => {
    toggleFeaturedVideo(item.id);
  };

  const handleTogglePublish = (item: YouTubeVideo) => {
    togglePublishVideo(item.id);
  };

  const handleExportBackup = () => {
    const json = exportVideosJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bbc-learning-content-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper to render a card based on its content type
  const renderCard = (item: YouTubeVideo) => {
    if (item.contentType === 'short') {
      return (
        <ShortCard
          key={item.id}
          shortItem={item}
          isAdmin={isAdmin}
          onPlay={() => setPlayingVideo(item)}
          onEdit={() => handleEditContent(item)}
          onDelete={() => handleDeleteContent(item)}
          onToggleFeatured={() => handleToggleFeatured(item)}
          onTogglePublish={() => handleTogglePublish(item)}
        />
      );
    }

    if (item.contentType === 'playlist') {
      return (
        <PlaylistCard
          key={item.id}
          playlistItem={item}
          isAdmin={isAdmin}
          onPlay={() => setPlayingVideo(item)}
          onEdit={() => handleEditContent(item)}
          onDelete={() => handleDeleteContent(item)}
          onToggleFeatured={() => handleToggleFeatured(item)}
          onTogglePublish={() => handleTogglePublish(item)}
        />
      );
    }

    // Default: VideoCard
    return (
      <VideoCard
        key={item.id}
        video={item}
        isAdmin={isAdmin}
        onPlay={() => setPlayingVideo(item)}
        onEdit={() => handleEditContent(item)}
        onDelete={() => handleDeleteContent(item)}
        onToggleFeatured={() => handleToggleFeatured(item)}
        onTogglePublish={() => handleTogglePublish(item)}
      />
    );
  };

  // Check if library is completely empty
  const isLibraryEmpty = videos.length === 0;

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

          {/* Admin Controls Area */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto shrink-0">
            {isAdmin ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Admin Mode Active</span>
                </span>

                <button
                  onClick={handleOpenAddContent}
                  className="btn-primary py-2 text-xs flex items-center gap-1.5"
                >
                  <Plus size={14} />
                  <span>Add Content</span>
                </button>

                <button
                  onClick={handleExportBackup}
                  title="Export library backup JSON"
                  className="p-2 rounded-xl bg-[#080D18] hover:bg-[#172945] border border-[#243650] hover:border-[#38BDF8] text-[#9FB0C8] hover:text-[#38BDF8] transition-colors"
                >
                  <Download size={14} />
                </button>

                <button
                  onClick={adminLogout}
                  title="Exit administrator session"
                  className="p-2 rounded-xl bg-[#080D18] hover:bg-[#172945] border border-[#243650] hover:border-red-500 text-[#9FB0C8] hover:text-red-400 transition-colors"
                >
                  <Unlock size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#080D18]/80 hover:bg-[#101D35] border border-[#243650] hover:border-[#38BDF8] text-[#9FB0C8] hover:text-[#DCE6F5] text-xs font-mono flex items-center gap-1.5 transition-all"
                title="Club administrator access"
              >
                <Lock size={12} className="text-[#38BDF8]" />
                <span>Admin Access</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* If library is completely empty, display required empty state */}
      {isLibraryEmpty ? (
        <div className="rounded-3xl bg-[#101D35]/50 border border-[#243650] p-12 sm:p-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#080D18] border border-[#243650] text-[#38BDF8] flex items-center justify-center mx-auto shadow-inner">
            <Film size={28} className="opacity-80" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg sm:text-xl font-bold text-[#DCE6F5]">
              Learning content is coming soon.
            </h3>
            <p className="text-xs sm:text-sm text-[#9FB0C8]">
              New tutorials and technical learning resources will be added here.
            </p>
          </div>
          {isAdmin && (
            <div className="pt-2">
              <button
                onClick={handleOpenAddContent}
                className="btn-primary py-2 text-xs inline-flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>Add Your First Resource</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* 2. Featured Item Highlight (if present and not actively searching) */}
          {featuredItem && !searchQuery.trim() && selectedCategory === 'All' && contentTypeFilter === 'all' && (
            <FeaturedVideoCard
              video={featuredItem}
              isAdmin={isAdmin}
              onPlay={() => setPlayingVideo(featuredItem)}
              onEdit={() => handleEditContent(featuredItem)}
              onDelete={() => handleDeleteContent(featuredItem)}
            />
          )}

          {/* 3. Four Browsing Filters (Tabs) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 p-1 bg-[#101D35] rounded-2xl border border-[#243650] overflow-x-auto">
              <button
                onClick={() => setContentTypeFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  contentTypeFilter === 'all'
                    ? 'bg-[#2563EB] text-white shadow-md'
                    : 'text-[#9FB0C8] hover:text-[#DCE6F5] hover:bg-[#172945]'
                }`}
              >
                <Sparkles size={12} />
                <span>All Content</span>
                <span className="text-[10px] opacity-75">({counts.all})</span>
              </button>

              <button
                onClick={() => setContentTypeFilter('video')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  contentTypeFilter === 'video'
                    ? 'bg-[#2563EB] text-white shadow-md'
                    : 'text-[#9FB0C8] hover:text-[#DCE6F5] hover:bg-[#172945]'
                }`}
              >
                <Film size={12} />
                <span>Videos</span>
                <span className="text-[10px] opacity-75">({counts.video})</span>
              </button>

              <button
                onClick={() => setContentTypeFilter('short')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  contentTypeFilter === 'short'
                    ? 'bg-[#2563EB] text-white shadow-md'
                    : 'text-[#9FB0C8] hover:text-[#DCE6F5] hover:bg-[#172945]'
                }`}
              >
                <Flame size={12} className={contentTypeFilter === 'short' ? 'text-white' : 'text-red-400'} />
                <span>Shorts</span>
                <span className="text-[10px] opacity-75">({counts.short})</span>
              </button>

              <button
                onClick={() => setContentTypeFilter('playlist')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  contentTypeFilter === 'playlist'
                    ? 'bg-[#2563EB] text-white shadow-md'
                    : 'text-[#9FB0C8] hover:text-[#DCE6F5] hover:bg-[#172945]'
                }`}
              >
                <ListVideo size={12} />
                <span>Playlists</span>
                <span className="text-[10px] opacity-75">({counts.playlist})</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search learning library..."
                className="w-full px-3.5 py-2 pl-9 rounded-xl bg-[#101D35] border border-[#243650] focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] text-xs text-[#DCE6F5] placeholder-[#9FB0C8]/50 outline-none transition-all"
              />
              <Search size={14} className="absolute left-3 top-2.5 text-[#9FB0C8]/60 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-2.5 text-[#9FB0C8] hover:text-[#DCE6F5]"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* 4. Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-mono text-[#9FB0C8] flex items-center gap-1 shrink-0 mr-1">
              <Filter size={12} className="text-[#38BDF8]" />
              <span>CATEGORY:</span>
            </span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all shrink-0 ${
                  selectedCategory === category
                    ? 'bg-[#38BDF8] text-[#080D18] font-bold shadow-[0_0_12px_rgba(56,189,248,0.35)]'
                    : 'bg-[#101D35] border border-[#243650] text-[#9FB0C8] hover:text-[#DCE6F5] hover:border-[#38BDF8]/40'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 5. Render Filtered Content Grid */}
          {visibleVideos.length === 0 ? (
            <div className="rounded-2xl bg-[#101D35]/50 border border-[#243650] p-10 text-center space-y-3">
              <p className="text-sm font-semibold text-[#DCE6F5]">
                No matching learning content found.
              </p>
              <p className="text-xs text-[#9FB0C8]">
                Try adjusting your search query, selecting another category, or switching content type.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setContentTypeFilter('all');
                }}
                className="btn-secondary py-1.5 px-3 text-xs inline-flex items-center gap-1"
              >
                <span>Reset Filters</span>
              </button>
            </div>
          ) : contentTypeFilter === 'short' ? (
            // Dedicated Shorts Portrait Grid (9:16)
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {visibleVideos.map((item) => renderCard(item))}
            </div>
          ) : contentTypeFilter === 'playlist' ? (
            // Dedicated Playlist 16:9 Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleVideos.map((item) => renderCard(item))}
            </div>
          ) : contentTypeFilter === 'video' ? (
            // Dedicated Video 16:9 Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleVideos.map((item) => renderCard(item))}
            </div>
          ) : (
            // "ALL" VIEW: Grouped & responsive presentation
            <div className="space-y-10">
              {/* Playlists Section (if any exist in results) */}
              {visibleVideos.some((v) => v.contentType === 'playlist') && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#243650]/60 pb-2.5">
                    <h3 className="text-base sm:text-lg font-bold text-[#DCE6F5] flex items-center gap-2">
                      <ListVideo size={18} className="text-[#38BDF8]" />
                      <span>Curated Playlists & Course Series</span>
                    </h3>
                    <button
                      onClick={() => setContentTypeFilter('playlist')}
                      className="text-xs font-mono text-[#38BDF8] hover:underline"
                    >
                      View All Playlists →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleVideos
                      .filter((v) => v.contentType === 'playlist')
                      .map((item) => renderCard(item))}
                  </div>
                </div>
              )}

              {/* Videos Section (if any exist in results) */}
              {visibleVideos.some((v) => v.contentType === 'video') && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#243650]/60 pb-2.5">
                    <h3 className="text-base sm:text-lg font-bold text-[#DCE6F5] flex items-center gap-2">
                      <Film size={18} className="text-[#38BDF8]" />
                      <span>Technical Tutorials & Sessions</span>
                    </h3>
                    <button
                      onClick={() => setContentTypeFilter('video')}
                      className="text-xs font-mono text-[#38BDF8] hover:underline"
                    >
                      View All Videos →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visibleVideos
                      .filter((v) => v.contentType === 'video')
                      .map((item) => renderCard(item))}
                  </div>
                </div>
              )}

              {/* Shorts Section (if any exist in results) */}
              {visibleVideos.some((v) => v.contentType === 'short') && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#243650]/60 pb-2.5">
                    <h3 className="text-base sm:text-lg font-bold text-[#DCE6F5] flex items-center gap-2">
                      <Flame size={18} className="text-red-400" />
                      <span>YouTube Shorts & Quick Insights</span>
                    </h3>
                    <button
                      onClick={() => setContentTypeFilter('short')}
                      className="text-xs font-mono text-[#38BDF8] hover:underline"
                    >
                      View All Shorts →
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {visibleVideos
                      .filter((v) => v.contentType === 'short')
                      .map((item) => renderCard(item))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 6. Video / Shorts / Playlist Player Lightbox Modal */}
      <YouTubePlayerModal
        video={playingVideo}
        onClose={() => setPlayingVideo(null)}
      />

      {/* 7. Add / Edit Content Modal */}
      <VideoManagementModal
        isOpen={isManagementOpen}
        videoToEdit={videoToEdit}
        onClose={() => setIsManagementOpen(false)}
        onSaved={() => reloadVideos()}
      />

      {/* 8. Admin Passcode Gate Modal */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setIsAdmin(true)}
      />
    </section>
  );
};
