import { YouTubeVideo, YouTubeContentType } from '../types/youtube';

const STORAGE_KEY = 'bbc_youtube_learning_videos';
const AUTH_KEY = 'bbc_admin_authenticated';
const PASSCODE_KEY = 'bbc_admin_passcode';
const DEFAULT_PASSCODE = 'bbcyt@2026';

/**
 * Automatically detects content type from a YouTube URL:
 * - 'short': URL contains /shorts/
 * - 'playlist': URL contains list= or /playlist/
 * - 'video': default standard video
 */
export function detectYouTubeContentType(url: string): YouTubeContentType {
  if (!url || typeof url !== 'string') return 'video';
  const trimmed = url.trim();

  if (/\/shorts\/[a-zA-Z0-9_-]+/i.test(trimmed)) {
    return 'short';
  }

  if (
    /[?&]list=([a-zA-Z0-9_-]+)/i.test(trimmed) ||
    /\/playlist\?/i.test(trimmed) ||
    /\/playlist\/([a-zA-Z0-9_-]+)/i.test(trimmed) ||
    /^(?:PL|UU|LL|FL|RD|OLAK5uy_)[a-zA-Z0-9_-]{10,}$/i.test(trimmed)
  ) {
    return 'playlist';
  }

  return 'video';
}

/**
 * Validates and extracts the 11-character YouTube video ID from various URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/live/VIDEO_ID
 */
export function extractYouTubeId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // If already an exact 11-character ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex covering watch?v=, embed/, shorts/, live/, and youtu.be/
  const match = trimmed.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  );

  return match ? match[1] : null;
}

/**
 * Extracts YouTube playlist ID from various URL formats:
 * - https://www.youtube.com/playlist?list=PLAYLIST_ID
 * - https://www.youtube.com/watch?v=VIDEO_ID&list=PLAYLIST_ID
 * - Direct Playlist ID (e.g. PL4cUxeGndAe..., UUD8...)
 */
export function extractPlaylistId(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // If already a standalone playlist ID
  if (/^(?:PL|UU|LL|FL|RD|OLAK5uy_)[a-zA-Z0-9_-]+$/i.test(trimmed)) {
    return trimmed;
  }

  // Search for list= query parameter
  const listMatch = trimmed.match(/[?&]list=([a-zA-Z0-9_-]+)/i);
  if (listMatch) {
    return listMatch[1];
  }

  // Search for /playlist/ID path
  const pathMatch = trimmed.match(/\/playlist\/([a-zA-Z0-9_-]+)/i);
  if (pathMatch) {
    return pathMatch[1];
  }

  return null;
}

/**
 * Returns standard YouTube thumbnail URL for a given video ID
 */
export function getYouTubeThumbnail(videoId: string, quality: 'hq' | 'maxres' = 'hq'): string {
  if (!videoId) return '';
  if (quality === 'maxres') {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Generates privacy-enhanced embed URL for video, short or playlist
 */
export function getYouTubeEmbedUrl(item: {
  contentType?: YouTubeContentType;
  youtubeId: string;
  playlistId?: string;
}): string {
  if (item.contentType === 'playlist') {
    const listId = item.playlistId || item.youtubeId;
    return `https://www.youtube-nocookie.com/embed/videoseries?list=${listId}&autoplay=1&rel=0`;
  }

  // For video and short
  return `https://www.youtube-nocookie.com/embed/${item.youtubeId}?autoplay=1&rel=0&modestbranding=1`;
}

/**
 * Generates direct external link for YouTube fallback
 */
export function getYouTubeExternalUrl(item: {
  contentType?: YouTubeContentType;
  youtubeId: string;
  playlistId?: string;
  youtubeUrl?: string;
}): string {
  if (item.youtubeUrl && item.youtubeUrl.startsWith('http')) {
    return item.youtubeUrl;
  }

  if (item.contentType === 'playlist') {
    const listId = item.playlistId || item.youtubeId;
    return `https://www.youtube.com/playlist?list=${listId}`;
  }

  if (item.contentType === 'short') {
    return `https://www.youtube.com/shorts/${item.youtubeId}`;
  }

  return `https://www.youtube.com/watch?v=${item.youtubeId}`;
}

/**
 * Fetches public metadata from YouTube's oEmbed endpoint (no API key required)
 * Works for videos, shorts, and playlists.
 */
export async function fetchYouTubeMetadata(
  urlOrId: string,
  contentType: YouTubeContentType = 'video'
): Promise<{
  title?: string;
  author?: string;
  thumbnailUrl?: string;
}> {
  let targetUrl = '';

  if (contentType === 'playlist') {
    const listId = extractPlaylistId(urlOrId);
    if (!listId) throw new Error('Invalid YouTube playlist link or ID');
    targetUrl = `https://www.youtube.com/playlist?list=${listId}`;
  } else {
    const videoId = extractYouTubeId(urlOrId);
    if (!videoId) throw new Error('Invalid YouTube video link or ID');
    targetUrl = `https://www.youtube.com/watch?v=${videoId}`;
  }

  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(targetUrl)}&format=json`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(oembedUrl, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        title: data.title,
        author: data.author_name,
        thumbnailUrl: data.thumbnail_url,
      };
    }
  } catch {
    // Soft fail on network / CORS
  }

  // Fallback thumbnail if it's a video/short
  if (contentType !== 'playlist') {
    const videoId = extractYouTubeId(urlOrId);
    if (videoId) {
      return {
        thumbnailUrl: getYouTubeThumbnail(videoId, 'hq'),
      };
    }
  }

  return {};
}

/**
 * Client-side image compressor for custom thumbnails.
 * Compresses an image file to a lightweight data URL for localStorage persistence.
 */
export function compressImageFile(
  file: File,
  maxWidth = 800,
  maxHeight = 450,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select an image file (PNG, JPG, WebP).'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for processing.'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Loads stored learning content from localStorage.
 * Automatically performs backward-compatible migration:
 * - If an existing record lacks contentType, it assigns 'video'
 * - Preserves all existing titles, descriptions, categories, thumbnails, etc.
 */
export function getStoredVideos(): YouTubeVideo[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((item) => {
      const contentType: YouTubeContentType = item.contentType || 'video';
      return {
        ...item,
        contentType,
        playlistId: item.playlistId || (contentType === 'playlist' ? item.youtubeId : undefined),
      };
    });
  } catch (error) {
    console.error('Error reading YouTube content from localStorage:', error);
    return [];
  }
}

/**
 * Saves or updates content (Video, Short, Playlist) in localStorage and broadcasts a change event.
 */
export function saveVideo(contentData: {
  id?: string;
  contentType: YouTubeContentType;
  youtubeUrl: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl?: string;
  customThumbnailUrl?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
}): YouTubeVideo {
  const { contentType, youtubeUrl } = contentData;
  const currentVideos = getStoredVideos();
  const now = new Date().toISOString();

  let resolvedYoutubeId = '';
  let resolvedPlaylistId: string | undefined = undefined;

  if (contentType === 'playlist') {
    const playlistId = extractPlaylistId(youtubeUrl);
    if (!playlistId) {
      throw new Error(
        'Please provide a valid YouTube playlist URL (e.g. https://www.youtube.com/playlist?list=...)'
      );
    }
    resolvedPlaylistId = playlistId;
    resolvedYoutubeId = playlistId;
  } else {
    // video or short
    const videoId = extractYouTubeId(youtubeUrl);
    if (!videoId) {
      throw new Error(
        `Please provide a valid YouTube ${contentType === 'short' ? 'Shorts' : 'video'} URL`
      );
    }
    resolvedYoutubeId = videoId;
  }

  // Determine thumbnail
  let finalThumbnail = contentData.customThumbnailUrl || contentData.thumbnailUrl;
  if (!finalThumbnail && contentType !== 'playlist') {
    finalThumbnail = getYouTubeThumbnail(resolvedYoutubeId, 'hq');
  }
  if (!finalThumbnail) {
    // Default fallback placeholder for playlist
    finalThumbnail =
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';
  }

  let savedItem: YouTubeVideo;

  if (contentData.id) {
    // Update existing entry
    const existingIndex = currentVideos.findIndex((v) => v.id === contentData.id);
    if (existingIndex === -1) {
      throw new Error(`Content item with ID "${contentData.id}" not found.`);
    }

    savedItem = {
      ...currentVideos[existingIndex],
      contentType,
      youtubeUrl: youtubeUrl.trim(),
      youtubeId: resolvedYoutubeId,
      playlistId: resolvedPlaylistId,
      title: contentData.title.trim() || `YouTube ${contentType.toUpperCase()}`,
      description: contentData.description.trim(),
      category: contentData.category || 'Programming',
      thumbnailUrl: finalThumbnail,
      customThumbnailUrl: contentData.customThumbnailUrl,
      isFeatured: Boolean(contentData.isFeatured),
      isPublished: contentData.isPublished !== undefined ? contentData.isPublished : true,
      updatedAt: now,
    };

    currentVideos[existingIndex] = savedItem;
  } else {
    // Create new entry
    // Check for duplicate
    const duplicate = currentVideos.find(
      (v) =>
        v.contentType === contentType &&
        (contentType === 'playlist'
          ? v.playlistId === resolvedPlaylistId
          : v.youtubeId === resolvedYoutubeId)
    );

    if (duplicate) {
      throw new Error(
        `This ${contentType} is already in the library as "${duplicate.title}".`
      );
    }

    savedItem = {
      id: `yt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      contentType,
      youtubeUrl: youtubeUrl.trim(),
      youtubeId: resolvedYoutubeId,
      playlistId: resolvedPlaylistId,
      title: contentData.title.trim() || `YouTube ${contentType.toUpperCase()}`,
      description: contentData.description.trim(),
      category: contentData.category || 'Programming',
      thumbnailUrl: finalThumbnail,
      customThumbnailUrl: contentData.customThumbnailUrl,
      isFeatured: Boolean(contentData.isFeatured),
      isPublished: contentData.isPublished !== undefined ? contentData.isPublished : true,
      createdAt: now,
      updatedAt: now,
    };

    currentVideos.unshift(savedItem);
  }

  // If marked as featured, update others to maintain single prominent featured highlight
  if (savedItem.isFeatured) {
    currentVideos.forEach((v) => {
      v.isFeatured = v.id === savedItem.id;
    });
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentVideos));
    window.dispatchEvent(new Event('bbc-videos-updated'));
  } catch (error) {
    console.error('Error saving YouTube content to localStorage:', error);
    throw new Error('Failed to save content to local storage.');
  }

  return savedItem;
}

/**
 * Deletes content by ID
 */
export function deleteVideo(id: string): void {
  const currentVideos = getStoredVideos();
  const filtered = currentVideos.filter((v) => v.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event('bbc-videos-updated'));
  } catch (error) {
    console.error('Error deleting content:', error);
  }
}

/**
 * Toggles published status
 */
export function togglePublishVideo(id: string): void {
  const currentVideos = getStoredVideos();
  const target = currentVideos.find((v) => v.id === id);
  if (target) {
    target.isPublished = !target.isPublished;
    target.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentVideos));
    window.dispatchEvent(new Event('bbc-videos-updated'));
  }
}

/**
 * Toggles featured status
 */
export function toggleFeaturedVideo(id: string): void {
  const currentVideos = getStoredVideos();
  const target = currentVideos.find((v) => v.id === id);
  if (target) {
    const nextFeatured = !target.isFeatured;
    if (nextFeatured) {
      currentVideos.forEach((v) => {
        v.isFeatured = v.id === id;
      });
    } else {
      target.isFeatured = false;
    }
    target.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentVideos));
    window.dispatchEvent(new Event('bbc-videos-updated'));
  }
}

// -------------------------------------------------------------
// Administrator Authentication Service (Client-Side Gate)
// -------------------------------------------------------------

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(AUTH_KEY) === 'true';
}

export function adminLogin(passcode: string): boolean {
  if (typeof window === 'undefined') return false;
  const rawPasscode = localStorage.getItem(PASSCODE_KEY);
  // Migrate away from old default if stored
  const configuredPasscode =
    !rawPasscode || rawPasscode === 'bbc@admin2026' ? DEFAULT_PASSCODE : rawPasscode;

  if (passcode.trim() === configuredPasscode) {
    sessionStorage.setItem(AUTH_KEY, 'true');
    window.dispatchEvent(new Event('bbc-admin-auth-changed'));
    return true;
  }
  return false;
}

export function adminLogout(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event('bbc-admin-auth-changed'));
}

export function exportVideosJson(): string {
  const videos = getStoredVideos();
  return JSON.stringify(videos, null, 2);
}

export function importVideosJson(jsonString: string): number {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) throw new Error('Data must be an array of learning content');
    const migrated = parsed.map((item) => ({
      ...item,
      contentType: item.contentType || 'video',
      playlistId: item.playlistId || (item.contentType === 'playlist' ? item.youtubeId : undefined),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    window.dispatchEvent(new Event('bbc-videos-updated'));
    return migrated.length;
  } catch (error) {
    console.error('Import error:', error);
    throw new Error('Invalid JSON format.');
  }
}
