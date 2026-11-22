import { YouTubeVideo, YouTubeContentType, ParsedYouTubeData } from '../types/youtube';

/**
 * ============================================================================
 * CENTRAL REUSABLE YOUTUBE URL PARSER
 * ============================================================================
 * Handles:
 * - youtube.com/watch?v=VIDEO_ID (including &list=, &t=, &si=)
 * - youtube.com/shorts/VIDEO_ID
 * - youtu.be/VIDEO_ID
 * - youtube.com/playlist?list=PLAYLIST_ID
 * - youtube.com/embed/VIDEO_ID or youtube.com/embed/videoseries?list=PLAYLIST_ID
 *
 * Returns:
 * - originalUrl: exact input URL
 * - normalizedUrl: clean, canonical YouTube URL
 * - contentType: 'video' | 'short' | 'playlist'
 * - videoId: 11-char ID where applicable
 * - playlistId: playlist ID where applicable
 * - embedUrl: ready-to-use autoplay embed URL
 * - externalUrl: direct destination URL on YouTube (never root homepage)
 * - thumbnailFallbackUrl: standard YouTube thumbnail URL
 * - isValid: true if a valid video or playlist was extracted
 */
export function parseYouTubeUrl(rawUrl: string): ParsedYouTubeData {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return {
      originalUrl: '',
      normalizedUrl: '',
      contentType: 'video',
      videoId: null,
      playlistId: null,
      embedUrl: null,
      externalUrl: null,
      thumbnailFallbackUrl: null,
      isValid: false,
    };
  }

  const trimmed = rawUrl.trim();
  let contentType: YouTubeContentType = 'video';
  let videoId: string | null = null;
  let playlistId: string | null = null;

  // 1. Check for playlist (list= parameter or /playlist/ path)
  const playlistMatch =
    trimmed.match(/[?&]list=([a-zA-Z0-9_-]+)/i) ||
    trimmed.match(/\/playlist\/([a-zA-Z0-9_-]+)/i);

  if (playlistMatch) {
    playlistId = playlistMatch[1];
    contentType = 'playlist';
  }

  // 2. Check for Shorts (/shorts/VIDEO_ID)
  const shortsMatch = trimmed.match(/\/shorts\/([a-zA-Z0-9_-]{11})/i);
  if (shortsMatch) {
    videoId = shortsMatch[1];
    contentType = 'short';
  }

  // 3. Check for standard YouTube video or youtu.be or embed
  if (!videoId) {
    const videoMatch = trimmed.match(
      /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
    );
    if (videoMatch) {
      videoId = videoMatch[1];
      if (!playlistMatch) {
        contentType = 'video';
      }
    }
  }

  // 4. Fallback for standalone IDs
  if (!videoId && !playlistId) {
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      videoId = trimmed;
      contentType = 'video';
    } else if (/^(?:PL|UU|LL|FL|RD|OLAK5uy_)[a-zA-Z0-9_-]+$/.test(trimmed)) {
      playlistId = trimmed;
      contentType = 'playlist';
    }
  }

  const isValid = Boolean(videoId || playlistId);

  // Generate Embed URL
  let embedUrl: string | null = null;
  if (contentType === 'playlist' && playlistId) {
    if (videoId) {
      embedUrl = `https://www.youtube.com/embed/${videoId}?list=${playlistId}&autoplay=1`;
    } else {
      embedUrl = `https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=1`;
    }
  } else if (videoId) {
    embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }

  // Generate External URL (strictly preserving destination, never root youtube.com)
  let externalUrl: string | null = null;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    externalUrl = trimmed;
  } else if (contentType === 'playlist' && playlistId) {
    externalUrl = `https://www.youtube.com/playlist?list=${playlistId}`;
  } else if (contentType === 'short' && videoId) {
    externalUrl = `https://www.youtube.com/shorts/${videoId}`;
  } else if (videoId) {
    externalUrl = `https://www.youtube.com/watch?v=${videoId}`;
  }

  // Standard YouTube thumbnail fallback
  let thumbnailFallbackUrl: string | null = null;
  if (videoId) {
    thumbnailFallbackUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  }

  const normalizedUrl = externalUrl || trimmed;

  return {
    originalUrl: trimmed,
    normalizedUrl,
    contentType,
    videoId,
    playlistId,
    embedUrl,
    externalUrl,
    thumbnailFallbackUrl,
    isValid,
  };
}

/**
 * ============================================================================
 * GOOGLE DRIVE THUMBNAIL RESOLVER
 * ============================================================================
 * Converts Google Drive sharing links into browser-displayable URLs:
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/file/d/FILE_ID/view
 * - https://drive.google.com/uc?id=FILE_ID
 * - https://drive.google.com/thumbnail?id=FILE_ID
 * - https://lh3.googleusercontent.com/d/FILE_ID
 * - Standalone File ID
 */
export function resolveGoogleDriveThumbnail(rawUrlOrId: string | undefined): string | null {
  if (!rawUrlOrId || typeof rawUrlOrId !== 'string') return null;
  const trimmed = rawUrlOrId.trim();

  // Extract 20+ character Drive file ID
  const driveMatch =
    trimmed.match(/(?:id=|\/d\/|\/file\/d\/)([a-zA-Z0-9_-]{20,})/i) ||
    trimmed.match(/google\.com\/.*?[\?&]id=([a-zA-Z0-9_-]{20,})/i) ||
    trimmed.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]{20,})/i);

  if (driveMatch && driveMatch[1]) {
    const fileId = driveMatch[1];
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1280`;
  }

  // Standalone ID
  if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed)) {
    return `https://drive.google.com/thumbnail?id=${trimmed}&sz=w1280`;
  }

  // Direct image URL (e.g., https://...)
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  return null;
}

/**
 * Legacy URL helper wrappers (delegate to central parser for 100% consistency)
 */
export function detectYouTubeContentType(url: string): YouTubeContentType {
  return parseYouTubeUrl(url).contentType;
}

export function extractYouTubeId(url: string): string | null {
  return parseYouTubeUrl(url).videoId;
}

export function extractPlaylistId(url: string): string | null {
  return parseYouTubeUrl(url).playlistId;
}

export function getYouTubeThumbnail(videoId: string, quality: 'hq' | 'maxres' = 'hq'): string {
  if (!videoId) return '';
  if (quality === 'maxres') {
    return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function getYouTubeEmbedUrl(item: {
  contentType?: YouTubeContentType;
  youtubeId: string;
  playlistId?: string;
  youtubeUrl?: string;
}): string {
  if (item.youtubeUrl) {
    const parsed = parseYouTubeUrl(item.youtubeUrl);
    if (parsed.embedUrl) return parsed.embedUrl;
  }

  if (item.contentType === 'playlist') {
    const listId = item.playlistId || item.youtubeId;
    return `https://www.youtube.com/embed/videoseries?list=${listId}&autoplay=1`;
  }

  return `https://www.youtube.com/embed/${item.youtubeId}?autoplay=1`;
}

export function getYouTubeExternalUrl(item: {
  contentType?: YouTubeContentType;
  youtubeId: string;
  playlistId?: string;
  youtubeUrl?: string;
}): string {
  if (item.youtubeUrl) {
    const parsed = parseYouTubeUrl(item.youtubeUrl);
    if (parsed.externalUrl) return parsed.externalUrl;
  }

  if (item.contentType === 'playlist') {
    const listId = item.playlistId || item.youtubeId;
    if (listId) return `https://www.youtube.com/playlist?list=${listId}`;
  }

  if (item.contentType === 'short') {
    if (item.youtubeId) return `https://www.youtube.com/shorts/${item.youtubeId}`;
  }

  if (item.youtubeId) {
    return `https://www.youtube.com/watch?v=${item.youtubeId}`;
  }

  // Return empty string if no valid URL can be constructed (never return root youtube.com)
  return '';
}

/**
 * Fetches public metadata from YouTube oEmbed endpoint (no API key required)
 */
export async function fetchYouTubeMetadata(
  urlOrId: string,
  contentType: YouTubeContentType = 'video'
): Promise<{
  title?: string;
  author?: string;
  thumbnailUrl?: string;
}> {
  const parsed = parseYouTubeUrl(urlOrId);
  const targetUrl = parsed.externalUrl;

  if (!targetUrl) return {};

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
    // Soft fail on network
  }

  if (parsed.thumbnailFallbackUrl) {
    return {
      thumbnailUrl: parsed.thumbnailFallbackUrl,
    };
  }

  return {};
}

/**
 * Fetches live video learning library from backend API endpoint (/api/youtube-learning)
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
      return result.data.map((item: any) => {
        const parsedUrl = parseYouTubeUrl(item.youtubeUrl);
        return {
          ...item,
          parsedUrl,
        };
      });
    }
    return [];
  } catch (err: any) {
    console.error('[YouTube Learning] Error fetching content:', err);
    throw err;
  }
}
