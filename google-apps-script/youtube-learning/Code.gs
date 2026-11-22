/**
 * =========================================================================
 * BINARY BATTLE CLUB — YOUTUBE LEARNING LIBRARY (APPS SCRIPT BACKEND)
 * =========================================================================
 *
 * Spreadsheet URL:
 * https://docs.google.com/spreadsheets/d/1hXrejoZzSYGoWpzB5SrohZpixQrXke9A9qRbWtYBnZw/edit?usp=sharing
 *
 * Spreadsheet ID:
 * 1hXrejoZzSYGoWpzB5SrohZpixQrXke9A9qRbWtYBnZw
 *
 * Tab: Sheet1 (or active sheet)
 *
 * This Apps Script provides a high-performance, read-only JSON Web App endpoint
 * that parses YouTube links, detects content types (video, short, playlist),
 * extracts IDs, converts Google Drive thumbnails to high-speed CDN URLs,
 * and returns standardized metadata for the Binary Battle Club frontend.
 */

// Target spreadsheet configuration
var SPREADSHEET_ID = '1hXrejoZzSYGoWpzB5SrohZpixQrXke9A9qRbWtYBnZw';
var SHEET_NAME = 'Sheet1';

/**
 * HTTP GET Handler: Returns JSON of all learning content
 */
function doGet(e) {
  try {
    var sheet = getTargetSheet();
    var data = sheet.getDataRange().getValues();

    if (!data || data.length <= 1) {
      // Empty or header-only sheet
      return createJsonResponse({
        success: true,
        count: 0,
        data: [],
        message: 'No learning content rows found in spreadsheet.',
      });
    }

    var headerRow = data[0];
    var colMap = mapHeaders(headerRow);

    var items = [];

    for (var r = 1; r < data.length; r++) {
      var row = data[r];
      var rawUrl = getVal(row, colMap.url);

      // Skip row if no link provided
      if (!rawUrl || String(rawUrl).trim() === '') {
        continue;
      }

      var url = String(rawUrl).trim();
      var uploadDate = getVal(row, colMap.date);
      var description = getVal(row, colMap.description);
      var rawTitle = getVal(row, colMap.title);
      var rawType = getVal(row, colMap.type);
      var rawThumbnail = getVal(row, colMap.thumbnail);
      var rawCategory = getVal(row, colMap.category);
      var rawPublished = getVal(row, colMap.published);
      var rawFeatured = getVal(row, colMap.featured);
      var rawOrder = getVal(row, colMap.order);

      // 1. Determine Content Type
      var contentType = resolveContentType(rawType, url);

      // 2. Extract YouTube Video / Playlist ID
      var videoId = extractYouTubeId(url);
      var playlistId = extractPlaylistId(url);

      if (contentType === 'playlist' && !playlistId && videoId) {
        playlistId = videoId;
      }

      // 3. Resolve Thumbnail (Drive CDN or standard YouTube thumbnail)
      var thumbnailUrl = resolveThumbnailUrl(rawThumbnail, videoId, contentType);

      // 4. Resolve Title
      var title = rawTitle ? String(rawTitle).trim() : '';
      if (!title) {
        if (description && String(description).trim().length > 0) {
          var firstLine = String(description).trim().split('\n')[0];
          title = firstLine.length > 60 ? firstLine.substring(0, 57) + '...' : firstLine;
        } else if (contentType === 'playlist') {
          title = 'Curated Learning Playlist #' + r;
        } else if (contentType === 'short') {
          title = 'Quick Concept #' + r;
        } else {
          title = 'Technical Tutorial #' + r;
        }
      }

      // 5. Check Published Status (default true unless explicitly marked FALSE/0/NO)
      var isPublished = true;
      if (rawPublished !== undefined && rawPublished !== null && String(rawPublished).trim() !== '') {
        var pubStr = String(rawPublished).trim().toLowerCase();
        if (pubStr === 'false' || pubStr === '0' || pubStr === 'no' || pubStr === 'draft') {
          isPublished = false;
        }
      }

      // 6. Check Featured Status
      var isFeatured = false;
      if (rawFeatured !== undefined && rawFeatured !== null && String(rawFeatured).trim() !== '') {
        var featStr = String(rawFeatured).trim().toLowerCase();
        if (featStr === 'true' || featStr === '1' || featStr === 'yes') {
          isFeatured = true;
        }
      }

      // 7. Category
      var category = rawCategory ? String(rawCategory).trim() : 'Programming';

      // 8. Display Order
      var displayOrder = parseInt(rawOrder, 10);
      if (isNaN(displayOrder)) {
        displayOrder = r;
      }

      var item = {
        id: 'yt_' + (videoId || playlistId || r),
        contentType: contentType,
        youtubeUrl: url,
        youtubeId: videoId || playlistId || '',
        playlistId: playlistId || undefined,
        title: title,
        description: description ? String(description).trim() : '',
        category: category,
        thumbnailUrl: thumbnailUrl,
        isFeatured: isFeatured,
        isPublished: isPublished,
        displayOrder: displayOrder,
        createdAt: uploadDate ? String(uploadDate).trim() : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      items.push(item);
    }

    // Sort: Featured first, then by displayOrder ascending
    items.sort(function (a, b) {
      if (a.isFeatured !== b.isFeatured) {
        return a.isFeatured ? -1 : 1;
      }
      return a.displayOrder - b.displayOrder;
    });

    return createJsonResponse({
      success: true,
      count: items.length,
      data: items,
      source: 'Google Apps Script',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return createJsonResponse({
      success: false,
      error: error.message || String(error),
    });
  }
}

/**
 * Handle OPTIONS preflight for CORS
 */
function doOptions(e) {
  var output = ContentService.createTextOutput('');
  return output;
}

/**
 * Helper to obtain the target worksheet
 */
function getTargetSheet() {
  var ss;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {}

  if (!ss) {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  }

  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    // Fall back to first sheet if Sheet1 not explicitly named
    var sheets = ss.getSheets();
    if (sheets.length > 0) {
      sheet = sheets[0];
    } else {
      throw new Error('Spreadsheet has no worksheets.');
    }
  }
  return sheet;
}

/**
 * Map header columns dynamically by inspecting header strings
 */
function mapHeaders(headerRow) {
  var map = {
    date: -1,
    url: -1,
    description: -1,
    title: -1,
    type: -1,
    thumbnail: -1,
    category: -1,
    published: -1,
    featured: -1,
    order: -1,
  };

  for (var i = 0; i < headerRow.length; i++) {
    var h = String(headerRow[i] || '').trim().toLowerCase();

    if (h.indexOf('date') !== -1 || h.indexOf('upload') !== -1) {
      map.date = i;
    } else if (
      h.indexOf('link') !== -1 ||
      h.indexOf('url') !== -1 ||
      h.indexOf('youtube') !== -1 ||
      h.indexOf('shorts') !== -1 ||
      h.indexOf('playlist') !== -1
    ) {
      map.url = i;
    } else if (h.indexOf('desc') !== -1) {
      map.description = i;
    } else if (h.indexOf('title') !== -1 || h.indexOf('name') !== -1) {
      map.title = i;
    } else if (h === 'type' || h.indexOf('content type') !== -1) {
      map.type = i;
    } else if (h.indexOf('thumb') !== -1 || h.indexOf('poster') !== -1 || h.indexOf('image') !== -1) {
      map.thumbnail = i;
    } else if (h.indexOf('cat') !== -1 || h.indexOf('tag') !== -1) {
      map.category = i;
    } else if (h.indexOf('pub') !== -1 || h.indexOf('visible') !== -1 || h.indexOf('status') !== -1) {
      map.published = i;
    } else if (h.indexOf('feat') !== -1 || h.indexOf('highlight') !== -1 || h.indexOf('star') !== -1) {
      map.featured = i;
    } else if (h.indexOf('order') !== -1 || h.indexOf('index') !== -1 || h.indexOf('sno') !== -1) {
      map.order = i;
    }
  }

  // Fallbacks if positional
  if (map.date === -1 && headerRow.length > 0) map.date = 0;
  if (map.url === -1 && headerRow.length > 1) map.url = 1;
  if (map.description === -1 && headerRow.length > 2) map.description = 2;

  return map;
}

function getVal(row, colIndex) {
  if (colIndex === -1 || colIndex === undefined || colIndex >= row.length) {
    return '';
  }
  return row[colIndex];
}

/**
 * Resolves content type: 'video', 'short', or 'playlist'
 */
function resolveContentType(rawType, url) {
  if (rawType && String(rawType).trim() !== '') {
    var t = String(rawType).trim().toLowerCase();
    if (t.indexOf('short') !== -1) return 'short';
    if (t.indexOf('play') !== -1 || t.indexOf('series') !== -1) return 'playlist';
    if (t.indexOf('vid') !== -1) return 'video';
  }

  // Automatic URL pattern inference
  var lower = String(url || '').toLowerCase();
  if (lower.indexOf('/shorts/') !== -1) {
    return 'short';
  }
  if (
    lower.indexOf('list=') !== -1 ||
    lower.indexOf('/playlist') !== -1 ||
    lower.indexOf('videoseries') !== -1
  ) {
    return 'playlist';
  }

  return 'video';
}

/**
 * Extract YouTube 11-char video ID
 */
function extractYouTubeId(url) {
  if (!url) return null;
  var str = String(url).trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
    return str;
  }
  var match = str.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
  );
  return match ? match[1] : null;
}

/**
 * Extract YouTube playlist ID
 */
function extractPlaylistId(url) {
  if (!url) return null;
  var str = String(url).trim();
  var listMatch = str.match(/[?&]list=([a-zA-Z0-9_-]+)/i);
  if (listMatch) return listMatch[1];
  var pathMatch = str.match(/\/playlist\/([a-zA-Z0-9_-]+)/i);
  if (pathMatch) return pathMatch[1];
  if (/^(?:PL|UU|LL|FL|RD|OLAK5uy_)[a-zA-Z0-9_-]+$/.test(str)) return str;
  return null;
}

/**
 * Resolve Thumbnail URL: converts Google Drive links or returns YouTube thumbnail
 */
function resolveThumbnailUrl(rawThumbnail, videoId, contentType) {
  if (rawThumbnail && String(rawThumbnail).trim() !== '') {
    var thumbStr = String(rawThumbnail).trim();
    // Convert Google Drive share link to Google Drive CDN URL
    var driveMatch = thumbStr.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]{20,})/);
    if (driveMatch) {
      return 'https://lh3.googleusercontent.com/d/' + driveMatch[1];
    }
    if (thumbStr.indexOf('http') === 0) {
      return thumbStr;
    }
  }

  // Fallback based on video ID
  if (videoId) {
    return 'https://img.youtube.com/vi/' + videoId + '/hqdefault.jpg';
  }

  // Playlist fallback
  if (contentType === 'playlist') {
    return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';
  }

  return '';
}

/**
 * Create JSON TextOutput response
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}
