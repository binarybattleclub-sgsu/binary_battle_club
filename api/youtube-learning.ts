import type { IncomingMessage, ServerResponse } from 'http';

export interface YouTubeItem {
  id: string;
  contentType: 'video' | 'short' | 'playlist';
  youtubeUrl: string;
  youtubeId: string;
  playlistId?: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  customThumbnailUrl?: string;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// In-memory cache for high-traffic performance
let cachedLearningData: { data: YouTubeItem[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

// Exact Target Spreadsheet
const SPREADSHEET_ID =
  process.env.YOUTUBE_SPREADSHEET_ID || '1hXrejoZzSYGoWpzB5SrohZpixQrXke9A9qRbWtYBnZw';
const SHEET_TAB = process.env.YOUTUBE_SHEET_TAB || 'Sheet1';

/**
 * Detect content type from URL:
 * - /shorts/ -> 'short'
 * - list= or /playlist/ -> 'playlist'
 * - default -> 'video'
 */
function detectContentType(url: string, explicitType?: string): 'video' | 'short' | 'playlist' {
  if (explicitType && explicitType.trim() !== '') {
    const t = explicitType.trim().toLowerCase();
    if (t.includes('short')) return 'short';
    if (t.includes('play') || t.includes('series')) return 'playlist';
    if (t.includes('vid')) return 'video';
  }

  const trimmed = (url || '').trim().toLowerCase();
  if (trimmed.includes('/shorts/')) return 'short';
  if (
    trimmed.includes('list=') ||
    trimmed.includes('/playlist') ||
    trimmed.includes('videoseries')
  ) {
    return 'playlist';
  }
  return 'video';
}

/**
 * Extract YouTube 11-char video ID
 */
function extractVideoId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  );
  return match ? match[1] : null;
}

/**
 * Extract YouTube playlist ID
 */
function extractPlaylistId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const listMatch = trimmed.match(/[?&]list=([a-zA-Z0-9_-]+)/i);
  if (listMatch) return listMatch[1];
  const pathMatch = trimmed.match(/\/playlist\/([a-zA-Z0-9_-]+)/i);
  if (pathMatch) return pathMatch[1];
  if (/^(?:PL|UU|LL|FL|RD|OLAK5uy_)[a-zA-Z0-9_-]+$/.test(trimmed)) return trimmed;
  return null;
}

/**
 * Resolve Thumbnail URL:
 * - If Google Drive share link, converts to fast Google Drive CDN url (lh3.googleusercontent.com/d/ID)
 * - If empty, generates standard YouTube thumbnail
 */
function resolveThumbnail(rawThumbnail: string, videoId: string | null, contentType: 'video' | 'short' | 'playlist'): string {
  if (rawThumbnail && rawThumbnail.trim() !== '') {
    const trimmed = rawThumbnail.trim();
    // Convert Google Drive share link to Google Drive CDN
    const driveMatch = trimmed.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]{20,})/);
    if (driveMatch) {
      return `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
    }
    if (trimmed.startsWith('http')) {
      return trimmed;
    }
  }

  // YouTube standard thumbnail
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  // Playlist fallback image
  if (contentType === 'playlist') {
    return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';
  }

  return '';
}

/**
 * Robust CSV Line Parser supporting quoted fields and embedded commas
 */
function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  const rawLines = text.split(/\r?\n/).filter((l) => l.trim() !== '');

  for (const line of rawLines) {
    const cells: string[] = [];
    let cur = '';
    let inQuote = false;

    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuote && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuote = !inQuote;
        }
      } else if (c === ',' && !inQuote) {
        cells.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    cells.push(cur.trim());
    lines.push(cells);
  }
  return lines;
}

/**
 * Main API Handler (GET /api/youtube-learning)
 */
export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  // Edge and browser caching headers (60s cache, 120s stale-while-revalidate)
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=120'
  );

  const now = Date.now();
  if (cachedLearningData && now - cachedLearningData.timestamp < CACHE_TTL_MS) {
    return res.status(200).json({
      success: true,
      count: cachedLearningData.data.length,
      data: cachedLearningData.data,
      cached: true,
      source: 'in-memory-cache',
    });
  }

  const appsScriptUrl =
    process.env.YOUTUBE_LEARNING_SCRIPT_URL ||
    process.env.GOOGLE_APPS_SCRIPT_YOUTUBE_URL ||
    process.env.GOOGLE_APPS_SCRIPT_URL;

  // 1. Try Google Apps Script if URL configured
  if (appsScriptUrl && appsScriptUrl.trim() !== '') {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const scriptRes = await fetch(appsScriptUrl.trim(), {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timeoutId);

      if (scriptRes.ok) {
        const json = await scriptRes.json();
        if (json && Array.isArray(json.data)) {
          cachedLearningData = { data: json.data, timestamp: now };
          return res.status(200).json({
            success: true,
            count: json.data.length,
            data: json.data,
            source: 'Google Apps Script',
          });
        }
      }
    } catch (e: any) {
      console.warn('[YouTube Learning] Apps Script fetch error or timeout, falling back to direct gviz CSV:', e.message);
    }
  }

  // 2. Resilient Direct Fallback: Google Sheets gviz CSV
  try {
    const csvUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
      SHEET_TAB
    )}`;

    const response = await fetch(csvUrl);
    if (!response.ok) {
      return res.status(502).json({
        success: false,
        error: `Could not fetch spreadsheet data from Google (HTTP ${response.status}). Ensure the spreadsheet is shared with "Anyone with the link can view".`,
      });
    }

    const csvText = await response.text();
    const rows = parseCSV(csvText);

    if (rows.length <= 1) {
      // Empty or header-only sheet
      cachedLearningData = { data: [], timestamp: now };
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
        source: 'Google Sheets gviz (Empty)',
      });
    }

    const headers = rows[0].map((h) => h.toLowerCase().trim());

    // Map column indices dynamically
    let colDate = -1;
    let colUrl = -1;
    let colDesc = -1;
    let colTitle = -1;
    let colType = -1;
    let colThumbnail = -1;
    let colCategory = -1;
    let colPublished = -1;
    let colFeatured = -1;
    let colOrder = -1;

    for (let i = 0; i < headers.length; i++) {
      const h = headers[i];
      if (h.includes('date') || h.includes('upload')) colDate = i;
      else if (
        h.includes('link') ||
        h.includes('url') ||
        h.includes('youtube') ||
        h.includes('shorts') ||
        h.includes('playlist')
      )
        colUrl = i;
      else if (h.includes('desc')) colDesc = i;
      else if (h.includes('title') || h.includes('name')) colTitle = i;
      else if (h === 'type' || h.includes('content type')) colType = i;
      else if (h.includes('thumb') || h.includes('poster') || h.includes('image'))
        colThumbnail = i;
      else if (h.includes('cat') || h.includes('tag')) colCategory = i;
      else if (h.includes('pub') || h.includes('visible') || h.includes('status'))
        colPublished = i;
      else if (h.includes('feat') || h.includes('star') || h.includes('highlight'))
        colFeatured = i;
      else if (h.includes('order') || h.includes('index') || h.includes('sno'))
        colOrder = i;
    }

    // Default positional mapping for current 3 headers
    if (colDate === -1 && headers.length > 0) colDate = 0;
    if (colUrl === -1 && headers.length > 1) colUrl = 1;
    if (colDesc === -1 && headers.length > 2) colDesc = 2;

    const items: YouTubeItem[] = [];

    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      const rawUrl = (row[colUrl] || '').replace(/^"|"$/g, '').trim();

      if (!rawUrl) continue;

      const dateStr = colDate !== -1 ? (row[colDate] || '').replace(/^"|"$/g, '').trim() : '';
      const descStr = colDesc !== -1 ? (row[colDesc] || '').replace(/^"|"$/g, '').trim() : '';
      const titleStr = colTitle !== -1 ? (row[colTitle] || '').replace(/^"|"$/g, '').trim() : '';
      const typeStr = colType !== -1 ? (row[colType] || '').replace(/^"|"$/g, '').trim() : '';
      const thumbStr =
        colThumbnail !== -1 ? (row[colThumbnail] || '').replace(/^"|"$/g, '').trim() : '';
      const catStr =
        colCategory !== -1 ? (row[colCategory] || '').replace(/^"|"$/g, '').trim() : '';
      const pubStr =
        colPublished !== -1 ? (row[colPublished] || '').replace(/^"|"$/g, '').trim() : '';
      const featStr =
        colFeatured !== -1 ? (row[colFeatured] || '').replace(/^"|"$/g, '').trim() : '';
      const orderStr =
        colOrder !== -1 ? (row[colOrder] || '').replace(/^"|"$/g, '').trim() : '';

      const contentType = detectContentType(rawUrl, typeStr);
      const videoId = extractVideoId(rawUrl);
      const playlistId = extractPlaylistId(rawUrl);

      // Check published status (default true unless explicitly false/0/no)
      let isPublished = true;
      if (pubStr) {
        const lowerPub = pubStr.toLowerCase();
        if (lowerPub === 'false' || lowerPub === '0' || lowerPub === 'no' || lowerPub === 'draft') {
          isPublished = false;
        }
      }

      // Check featured status
      let isFeatured = false;
      if (featStr) {
        const lowerFeat = featStr.toLowerCase();
        if (lowerFeat === 'true' || lowerFeat === '1' || lowerFeat === 'yes') {
          isFeatured = true;
        }
      }

      // Resolve thumbnail
      const thumbnailUrl = resolveThumbnail(thumbStr, videoId, contentType);

      // Resolve title
      let title = titleStr;
      if (!title) {
        if (descStr) {
          const firstLine = descStr.split('\n')[0].trim();
          title = firstLine.length > 60 ? firstLine.substring(0, 57) + '...' : firstLine;
        } else if (contentType === 'playlist') {
          title = `Curated Learning Playlist #${r}`;
        } else if (contentType === 'short') {
          title = `Quick Concept #${r}`;
        } else {
          title = `Technical Tutorial #${r}`;
        }
      }

      const displayOrder = parseInt(orderStr, 10) || r;

      items.push({
        id: `yt_${videoId || playlistId || r}`,
        contentType,
        youtubeUrl: rawUrl,
        youtubeId: videoId || playlistId || '',
        playlistId: playlistId || undefined,
        title,
        description: descStr,
        category: catStr || 'Programming',
        thumbnailUrl,
        isFeatured,
        isPublished,
        displayOrder,
        createdAt: dateStr || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    // Sort: Featured items first, then by displayOrder ascending
    items.sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
      return a.displayOrder - b.displayOrder;
    });

    cachedLearningData = { data: items, timestamp: now };

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
      source: 'Google Sheets gviz CSV (Direct)',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal error fetching YouTube learning content.',
    });
  }
}
