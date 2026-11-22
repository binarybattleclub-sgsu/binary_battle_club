export type YouTubeContentType = 'video' | 'short' | 'playlist';

export interface ParsedYouTubeData {
  originalUrl: string;
  normalizedUrl: string;
  contentType: YouTubeContentType;
  videoId: string | null;
  playlistId: string | null;
  embedUrl: string | null;
  externalUrl: string | null;
  thumbnailFallbackUrl: string | null;
  isValid: boolean;
}

export interface YouTubeVideo {
  id: string;
  contentType: YouTubeContentType;
  youtubeUrl: string;
  youtubeId: string;
  playlistId?: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  customThumbnailUrl?: string;
  fallbackThumbnailUrl?: string;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder?: number;
  parsedUrl?: ParsedYouTubeData;
  createdAt: string;
  updatedAt: string;
}

export type ContentTypeFilter = 'all' | 'video' | 'short' | 'playlist';

export const DEFAULT_CATEGORIES = [
  'All',
  'Programming',
  'Web Development',
  'Artificial Intelligence',
  'Machine Learning',
  'Data Structures & Algorithms',
  'Development Tools',
  'Workshops & Tutorials',
] as const;

export type VideoCategory = (typeof DEFAULT_CATEGORIES)[number];
