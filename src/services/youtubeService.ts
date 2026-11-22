import { YouTubeVideo, YouTubeContentType } from '../types/youtube';

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
  if (/^(?:PL|UU|LL|FL|RD|OLAK5uy_)[a-zA-Z0-9_-]+$/.test(trimmed)) {
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
 * Converts Google Drive sharing link to fast Google Drive CDN URL
 */
export function convertDriveUrlToCdn(url: string): string {
  if (!url) return '';
  const match = url.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]{20,})/);
  if (match) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  return url;
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
 * Fetches live video learning library from Google Sheets backend API endpoint (/api/youtube-learning)
 */
export async function fetchYouTubeLearningContent(): Promise<YouTubeVideo[]> {
  try {
    const response = await fetch('/api/youtube-learning', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch learning content (HTTP ${response.status})`);
    }

    const result = await response.json();
    if (result && Array.isArray(result.data)) {
      return result.data;
    }
    return [];
  } catch (err: any) {
    console.error('[YouTube Learning] Error fetching content:', err);
    throw err;
  }
}
