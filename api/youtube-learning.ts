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
  fallbackThumbnailUrl?: string;
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
 * Robust Central YouTube URL Parser
 */
function parseYouTubeUrl(url: string) {
  if (!url || typeof url !== 'string') {
    return {
      contentType: 'video' as const,
      videoId: null,
      playlistId: null,
      embedUrl: null,
      externalUrl: null,
      isValid: false,
    };
  }

  const trimmed = url.trim();
  let contentType: 'video' | 'short' | 'playlist' = 'video';
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

  // Standalone IDs
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

  return {
    contentType,
    videoId,
    playlistId,
    embedUrl,
    externalUrl,
    isValid,
  };
}

/**
 * Extract Google Drive file ID and convert to reliable browser-displayable URL
 */
function resolveGoogleDriveThumbnail(rawUrlOrId: string | undefined): string | null {
  if (!rawUrlOrId || typeof rawUrlOrId !== 'string') return null;
  const trimmed = rawUrlOrId.trim();

  // 1. Match common Drive sharing link formats
  const driveMatch =
    trimmed.match(/(?:id=|\/d\/|\/file\/d\/)([a-zA-Z0-9_-]{20,})/i) ||
    trimmed.match(/google\.com\/.*?[\?&]id=([a-zA-Z0-9_-]{20,})/i) ||
    trimmed.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]{20,})/i);

  if (driveMatch && driveMatch[1]) {
    const fileId = driveMatch[1];
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1280`;
  }

  // 2. Direct 25+ char alphanumeric ID
  if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed)) {
    return `https://drive.google.com/thumbnail?id=${trimmed}&sz=w1280`;
  }

  // 3. Direct HTTP(S) URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  return null;
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
        if (json && Array.isArray(json.data) && json.data.length > 0) {
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
      cachedLearningData = { data: [], timestamp: now };
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
        source: 'Google Sheets gviz (Empty)',
      });
    }

    const rawHeaders = rows[0];
    let colDate = -1;
    let colUrl = -1;
    let colDesc = -1;
    let colThumbnail = -1;
    let colTitle = -1;
    let colType = -1;
    let colCategory = -1;
    let colPublished = -1;
    let colFeatured = -1;
    let colOrder = -1;

    // Strict unambiguous header matching
    for (let i = 0; i < rawHeaders.length; i++) {
      const h = rawHeaders[i].toLowerCase().replace(/\s+/g, ' ').trim();

      // Check THUMBNAIL first to prevent "THUMBNAIL DRIVE LINK" matching URL!
      if (
        h.includes('thumb') ||
        h.includes('drive link') ||
        h.includes('poster') ||
        h === 'image' ||
        h.includes('thumbnail drive link')
      ) {
        colThumbnail = i;
      } else if (
        h.includes('youtube') ||
        h.includes('video link') ||
        h.includes('playlist link') ||
        h.includes('shorts link') ||
        h.includes('link of youtube') ||
        h === 'link' ||
        h === 'url'
      ) {
        colUrl = i;
      } else if (h.includes('date') || h.includes('upload')) {
        colDate = i;
      } else if (h.includes('desc')) {
        colDesc = i;
      } else if (h === 'title' || h.includes('title') || h === 'name') {
        colTitle = i;
      } else if (h === 'type' || h.includes('content type')) {
        colType = i;
      } else if (h.includes('cat') || h.includes('tag')) {
        colCategory = i;
      } else if (h.includes('pub') || h.includes('visible') || h.includes('status')) {
        colPublished = i;
      } else if (h.includes('feat') || h.includes('star') || h.includes('highlight')) {
        colFeatured = i;
      } else if (h.includes('order') || h.includes('index') || h.includes('sno')) {
        colOrder = i;
      }
    }

    // Default positional fallbacks
    if (colDate === -1 && rawHeaders.length > 0) colDate = 0;
    if (colUrl === -1 && rawHeaders.length > 1) colUrl = 1;
    if (colDesc === -1 && rawHeaders.length > 2) colDesc = 2;
    if (colThumbnail === -1 && rawHeaders.length > 3) colThumbnail = 3;

    const items: YouTubeItem[] = [];

    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      const rawUrl = colUrl !== -1 ? (row[colUrl] || '').replace(/^"|"$/g, '').trim() : '';

      if (!rawUrl) continue;

      const dateStr = colDate !== -1 ? (row[colDate] || '').replace(/^"|"$/g, '').trim() : '';
      const descStr = colDesc !== -1 ? (row[colDesc] || '').replace(/^"|"$/g, '').trim() : '';
      const thumbStr =
        colThumbnail !== -1 ? (row[colThumbnail] || '').replace(/^"|"$/g, '').trim() : '';
      const titleStr = colTitle !== -1 ? (row[colTitle] || '').replace(/^"|"$/g, '').trim() : '';
      const typeStr = colType !== -1 ? (row[colType] || '').replace(/^"|"$/g, '').trim() : '';
      const catStr =
        colCategory !== -1 ? (row[colCategory] || '').replace(/^"|"$/g, '').trim() : '';
      const pubStr =
        colPublished !== -1 ? (row[colPublished] || '').replace(/^"|"$/g, '').trim() : '';
      const featStr =
        colFeatured !== -1 ? (row[colFeatured] || '').replace(/^"|"$/g, '').trim() : '';
      const orderStr =
        colOrder !== -1 ? (row[colOrder] || '').replace(/^"|"$/g, '').trim() : '';

      // Central URL parsing
      const parsed = parseYouTubeUrl(rawUrl);
      const contentType = (typeStr.toLowerCase().includes('short')
        ? 'short'
        : typeStr.toLowerCase().includes('play')
        ? 'playlist'
        : typeStr.toLowerCase().includes('vid')
        ? 'video'
        : parsed.contentType) as 'video' | 'short' | 'playlist';

      const videoId = parsed.videoId;
      const playlistId = parsed.playlistId;

      // Published check (default true)
      let isPublished = true;
      if (pubStr) {
        const lowerPub = pubStr.toLowerCase();
        if (lowerPub === 'false' || lowerPub === '0' || lowerPub === 'no' || lowerPub === 'draft') {
          isPublished = false;
        }
      }

      // Featured check
      let isFeatured = false;
      if (featStr) {
        const lowerFeat = featStr.toLowerCase();
        if (lowerFeat === 'true' || lowerFeat === '1' || lowerFeat === 'yes') {
          isFeatured = true;
        }
      }

      // 1. Primary Thumbnail: Google Drive link from spreadsheet
      const customDriveThumb = resolveGoogleDriveThumbnail(thumbStr);

      // 2. Secondary Fallback Thumbnail: YouTube standard thumbnail
      let fallbackThumb = '';
      if (videoId) {
        fallbackThumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
      }

      // If playlist has no videoId and no customDriveThumb, fetch oEmbed thumbnail asynchronously
      if (!customDriveThumb && !fallbackThumb && contentType === 'playlist' && playlistId) {
        try {
          const oRes = await fetch(
            `https://www.youtube.com/oembed?url=${encodeURIComponent(
              `https://www.youtube.com/playlist?list=${playlistId}`
            )}&format=json`
          );
          if (oRes.ok) {
            const oJson = await oRes.json();
            if (oJson.thumbnail_url) {
              fallbackThumb = oJson.thumbnail_url;
            }
          }
        } catch {}
      }

      const finalThumb = customDriveThumb || fallbackThumb || '';

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
        youtubeUrl: parsed.externalUrl || rawUrl,
        youtubeId: videoId || playlistId || '',
        playlistId: playlistId || undefined,
        title,
        description: descStr,
        category: catStr || 'Programming',
        thumbnailUrl: finalThumb,
        customThumbnailUrl: customDriveThumb || undefined,
        fallbackThumbnailUrl: fallbackThumb || undefined,
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
