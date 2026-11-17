import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Film,
  Flame,
  ListVideo,
  Upload,
  Image as ImageIcon,
  RotateCcw,
} from 'lucide-react';
import { YouTubeIcon } from './YouTubeIcon';
import {
  YouTubeVideo,
  YouTubeContentType,
  DEFAULT_CATEGORIES,
} from '../../types/youtube';
import {
  detectYouTubeContentType,
  extractYouTubeId,
  extractPlaylistId,
  fetchYouTubeMetadata,
  getYouTubeThumbnail,
  saveVideo,
  compressImageFile,
} from '../../services/youtubeService';

interface VideoManagementModalProps {
  isOpen: boolean;
  videoToEdit: YouTubeVideo | null;
  onClose: () => void;
  onSaved: (item: YouTubeVideo) => void;
}

export const VideoManagementModal: React.FC<VideoManagementModalProps> = ({
  isOpen,
  videoToEdit,
  onClose,
  onSaved,
}) => {
  // Form values
  const [contentType, setContentType] = useState<YouTubeContentType>('video');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('Programming');
  const [customCategory, setCustomCategory] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  // Custom thumbnail states
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [customThumbnailData, setCustomThumbnailData] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Status & Validation
  const [extractedId, setExtractedId] = useState<string | null>(null);
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state when opening in edit vs add mode
  useEffect(() => {
    if (!isOpen) {
      resetForm();
      return;
    }

    if (videoToEdit) {
      setContentType(videoToEdit.contentType || 'video');
      setUrl(videoToEdit.youtubeUrl);
      setTitle(videoToEdit.title);
      setDescription(videoToEdit.description);
      const isDefaultCat = (DEFAULT_CATEGORIES as readonly string[]).includes(videoToEdit.category);
      if (isDefaultCat) {
        setCategory(videoToEdit.category);
        setCustomCategory('');
      } else {
        setCategory('Other');
        setCustomCategory(videoToEdit.category);
      }
      setIsFeatured(videoToEdit.isFeatured);
      setIsPublished(videoToEdit.isPublished);
      setExtractedId(
        videoToEdit.contentType === 'playlist'
          ? videoToEdit.playlistId || videoToEdit.youtubeId
          : videoToEdit.youtubeId
      );
      setThumbnailPreview(videoToEdit.customThumbnailUrl || videoToEdit.thumbnailUrl);
      setCustomThumbnailData(videoToEdit.customThumbnailUrl || null);
      setError(null);
    } else {
      resetForm();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, videoToEdit, onClose]);

  const resetForm = () => {
    setContentType('video');
    setUrl('');
    setTitle('');
    setDescription('');
    setCategory('Programming');
    setCustomCategory('');
    setIsFeatured(false);
    setIsPublished(true);
    setThumbnailPreview(null);
    setCustomThumbnailData(null);
    setExtractedId(null);
    setIsFetchingMeta(false);
    setError(null);
  };

  // URL input handler with automatic content-type detection & metadata auto-fetch
  const handleUrlChange = async (newUrl: string) => {
    setUrl(newUrl);
    setError(null);

    if (!newUrl.trim()) {
      setExtractedId(null);
      if (!customThumbnailData) setThumbnailPreview(null);
      return;
    }

    // Auto-detect content type if not editing an existing item
    const detectedType = detectYouTubeContentType(newUrl);
    if (!videoToEdit) {
      setContentType(detectedType);
    }

    const activeType = videoToEdit ? contentType : detectedType;
    let validId: string | null = null;

    if (activeType === 'playlist') {
      validId = extractPlaylistId(newUrl);
    } else {
      validId = extractYouTubeId(newUrl);
    }

    setExtractedId(validId);

    if (!validId) {
      if (!customThumbnailData) setThumbnailPreview(null);
      return;
    }

    // Setup initial thumbnail if not custom
    if (!customThumbnailData && activeType !== 'playlist') {
      const defaultThumb = getYouTubeThumbnail(validId, 'hq');
      setThumbnailPreview(defaultThumb);
    }

    // Auto-fetch oEmbed metadata (title & thumbnail) if title is empty
    if (!videoToEdit || !title.trim()) {
      setIsFetchingMeta(true);
      try {
        const meta = await fetchYouTubeMetadata(newUrl, activeType);
        if (meta.title && (!title || !title.trim())) {
          setTitle(meta.title);
        }
        if (meta.thumbnailUrl && !customThumbnailData) {
          setThumbnailPreview(meta.thumbnailUrl);
        }
      } catch {
        // Soft fail
      } finally {
        setIsFetchingMeta(false);
      }
    }
  };

  // Handle switching content type tab manually
  const handleContentTypeSelect = (newType: YouTubeContentType) => {
    setContentType(newType);
    setError(null);

    // Re-validate current URL with new content type
    if (url.trim()) {
      if (newType === 'playlist') {
        const pId = extractPlaylistId(url);
        setExtractedId(pId);
      } else {
        const vId = extractYouTubeId(url);
        setExtractedId(vId);
        if (vId && !customThumbnailData) {
          setThumbnailPreview(getYouTubeThumbnail(vId, 'hq'));
        }
      }
    }
  };

  // Handle custom image file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setError(null);

    try {
      const maxWidth = contentType === 'short' ? 450 : 800;
      const maxHeight = contentType === 'short' ? 800 : 450;
      const compressedDataUrl = await compressImageFile(file, maxWidth, maxHeight, 0.82);
      setCustomThumbnailData(compressedDataUrl);
      setThumbnailPreview(compressedDataUrl);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to process image upload.');
      }
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Reset custom thumbnail back to YouTube default
  const handleResetThumbnail = () => {
    setCustomThumbnailData(null);
    if (extractedId && contentType !== 'playlist') {
      setThumbnailPreview(getYouTubeThumbnail(extractedId, 'hq'));
    } else {
      setThumbnailPreview(null);
    }
  };

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (contentType === 'playlist') {
      const playlistId = extractPlaylistId(url);
      if (!playlistId) {
        setError('Please provide a valid YouTube playlist URL (e.g. https://www.youtube.com/playlist?list=...)');
        return;
      }
    } else {
      const videoId = extractYouTubeId(url);
      if (!videoId) {
        setError(`Please provide a valid YouTube ${contentType === 'short' ? 'Shorts' : 'video'} URL`);
        return;
      }
    }

    const finalCategory = category === 'Other' ? customCategory.trim() || 'General' : category;

    try {
      const saved = saveVideo({
        id: videoToEdit ? videoToEdit.id : undefined,
        contentType,
        youtubeUrl: url,
        title: title.trim() || `YouTube ${contentType.toUpperCase()}`,
        description: description.trim(),
        category: finalCategory,
        thumbnailUrl: thumbnailPreview || undefined,
        customThumbnailUrl: customThumbnailData || undefined,
        isFeatured,
        isPublished,
      });

      onSaved(saved);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while saving the content.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="content-mgmt-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#080D18]/90 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#101D35] border border-[#243650] rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_rgba(8,13,24,0.95)] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#243650] bg-[#080D18]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB]/15 text-[#38BDF8] flex items-center justify-center border border-[#2563EB]/30">
              {contentType === 'playlist' ? (
                <ListVideo size={16} />
              ) : contentType === 'short' ? (
                <Flame size={16} className="text-red-400" />
              ) : (
                <Film size={16} />
              )}
            </div>
            <div>
              <h2 id="content-mgmt-title" className="text-base sm:text-lg font-bold text-[#DCE6F5]">
                {videoToEdit ? 'Edit Learning Content' : 'Add Learning Content'}
              </h2>
              <p className="text-xs text-[#9FB0C8]">
                Curate tutorials, Shorts, and playlists for the community
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg bg-[#101D35] hover:bg-[#172945] border border-[#243650] text-[#9FB0C8] hover:text-[#DCE6F5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-2.5">
              <AlertTriangle size={15} className="shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Content Type Selector Tabs */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold text-[#DCE6F5]">
              CONTENT_TYPE <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleContentTypeSelect('video')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  contentType === 'video'
                    ? 'bg-[#2563EB] border-[#38BDF8] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                    : 'bg-[#080D18] border-[#243650] text-[#9FB0C8] hover:text-[#DCE6F5] hover:bg-[#172945]'
                }`}
              >
                <Film size={14} />
                <span>Video</span>
              </button>

              <button
                type="button"
                onClick={() => handleContentTypeSelect('short')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  contentType === 'short'
                    ? 'bg-[#2563EB] border-[#38BDF8] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                    : 'bg-[#080D18] border-[#243650] text-[#9FB0C8] hover:text-[#DCE6F5] hover:bg-[#172945]'
                }`}
              >
                <Flame size={14} className={contentType === 'short' ? 'text-white' : 'text-red-400'} />
                <span>Short</span>
              </button>

              <button
                type="button"
                onClick={() => handleContentTypeSelect('playlist')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  contentType === 'playlist'
                    ? 'bg-[#2563EB] border-[#38BDF8] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                    : 'bg-[#080D18] border-[#243650] text-[#9FB0C8] hover:text-[#DCE6F5] hover:bg-[#172945]'
                }`}
              >
                <ListVideo size={14} />
                <span>Playlist</span>
              </button>
            </div>
            <p className="text-[11px] text-[#9FB0C8]/70">
              Type auto-detects when you paste a YouTube link (e.g. /shorts/ or list=).
            </p>
          </div>

          {/* 2. YouTube URL Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold text-[#DCE6F5] flex items-center justify-between">
              <span>
                YOUTUBE_{contentType.toUpperCase()}_URL <span className="text-red-400">*</span>
              </span>
              {extractedId && (
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={11} />
                  <span>
                    Valid {contentType === 'playlist' ? 'Playlist' : 'Video'} ID: {extractedId}
                  </span>
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder={
                  contentType === 'playlist'
                    ? 'e.g. https://www.youtube.com/playlist?list=PL4cUxeGndAe... or https://youtu.be/...&list=...'
                    : contentType === 'short'
                    ? 'e.g. https://www.youtube.com/shorts/VIDEO_ID'
                    : 'e.g. https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/...'
                }
                className="w-full px-4 py-2.5 rounded-xl bg-[#080D18] border border-[#243650] focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] text-xs sm:text-sm text-[#DCE6F5] placeholder-[#9FB0C8]/40 outline-none transition-all pr-10"
              />
              <div className="absolute right-3 top-2.5 pointer-events-none">
                {isFetchingMeta ? (
                  <Loader2 size={16} className="text-[#38BDF8] animate-spin" />
                ) : (
                  <YouTubeIcon size={16} className="text-red-500" />
                )}
              </div>
            </div>
          </div>

          {/* 3. Thumbnail Preview & Custom Upload */}
          <div className="space-y-2 p-3.5 rounded-xl bg-[#080D18]/70 border border-[#243650]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-[#DCE6F5] flex items-center gap-1.5">
                <ImageIcon size={13} className="text-[#38BDF8]" />
                <span>THUMBNAIL_PREVIEW</span>
              </label>

              <div className="flex items-center gap-2">
                {customThumbnailData && (
                  <button
                    type="button"
                    onClick={handleResetThumbnail}
                    className="text-[11px] font-mono text-[#9FB0C8] hover:text-[#38BDF8] flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw size={11} />
                    <span>Reset to YouTube</span>
                  </button>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="px-2.5 py-1 rounded-lg bg-[#101D35] hover:bg-[#172945] border border-[#243650] hover:border-[#38BDF8] text-xs text-[#38BDF8] font-mono flex items-center gap-1.5 transition-colors"
                >
                  <Upload size={12} />
                  <span>{isUploadingImage ? 'Processing...' : 'Upload Custom Cover'}</span>
                </button>
              </div>
            </div>

            {thumbnailPreview ? (
              <div
                className={`relative mx-auto overflow-hidden rounded-xl border border-[#243650] bg-[#080D18] ${
                  contentType === 'short'
                    ? 'w-32 aspect-[9/16]'
                    : 'w-full max-w-sm aspect-video'
                }`}
              >
                <img
                  src={thumbnailPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                {customThumbnailData && (
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-[#2563EB]/90 text-white text-[9px] font-mono uppercase">
                    Custom Cover
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-[#9FB0C8]/60 font-mono">
                Paste a YouTube URL or click &quot;Upload Custom Cover&quot; to preview
              </div>
            )}
          </div>

          {/* 4. Content Title Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold text-[#DCE6F5] flex items-center justify-between">
              <span>CONTENT_TITLE</span>
              <span className="text-[10px] text-[#9FB0C8]/60">Auto-fetched or custom</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`e.g. ${
                contentType === 'playlist'
                  ? 'Complete Web Development Bootcamp 2026'
                  : contentType === 'short'
                  ? '3 Git Commands Every BCA Student Must Know'
                  : 'Gemini AI System Architecture & Prompt Engineering'
              }`}
              className="w-full px-4 py-2.5 rounded-xl bg-[#080D18] border border-[#243650] focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] text-xs sm:text-sm text-[#DCE6F5] placeholder-[#9FB0C8]/40 outline-none transition-all"
            />
          </div>

          {/* 5. Short Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold text-[#DCE6F5]">
              SHORT_DESCRIPTION
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe key learning outcomes, prerequisites, or topics covered..."
              className="w-full px-4 py-2 rounded-xl bg-[#080D18] border border-[#243650] focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] text-xs sm:text-sm text-[#DCE6F5] placeholder-[#9FB0C8]/40 outline-none transition-all resize-none"
            />
          </div>

          {/* 6. Category Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono font-semibold text-[#DCE6F5]">
              CATEGORY
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#080D18] border border-[#243650] focus:border-[#38BDF8] text-xs sm:text-sm text-[#DCE6F5] outline-none transition-all"
              >
                {DEFAULT_CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="Other">+ Custom Category...</option>
              </select>

              {category === 'Other' && (
                <input
                  type="text"
                  required
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category name..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080D18] border border-[#243650] focus:border-[#38BDF8] text-xs sm:text-sm text-[#DCE6F5] placeholder-[#9FB0C8]/40 outline-none transition-all"
                />
              )}
            </div>
          </div>

          {/* 7. Toggles: Featured & Published */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Featured toggle */}
            <label className="flex items-center gap-3 p-3 rounded-xl bg-[#080D18]/80 border border-[#243650] cursor-pointer hover:border-[#38BDF8]/40 transition-colors">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-[#2563EB] bg-[#101D35] border-[#243650] focus:ring-[#38BDF8]"
              />
              <div className="text-xs">
                <span className="font-semibold text-[#DCE6F5] block">Featured Content</span>
                <span className="text-[11px] text-[#9FB0C8]/70">Pin prominently to top banner</span>
              </div>
            </label>

            {/* Published status toggle */}
            <label className="flex items-center gap-3 p-3 rounded-xl bg-[#080D18]/80 border border-[#243650] cursor-pointer hover:border-[#38BDF8]/40 transition-colors">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded text-[#2563EB] bg-[#101D35] border-[#243650] focus:ring-[#38BDF8]"
              />
              <div className="text-xs">
                <span className="font-semibold text-[#DCE6F5] block">Publicly Published</span>
                <span className="text-[11px] text-[#9FB0C8]/70">Visible to all visitors</span>
              </div>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#243650]">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary py-2 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary py-2 text-xs"
            >
              <span>{videoToEdit ? 'Save Changes' : 'Save & Publish Content'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
