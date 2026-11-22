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
 * extracts IDs, converts Google Drive thumbnails (including Smart Chips)
 * to high-speed CDN URLs, and returns standardized metadata for the
 * Binary Battle Club frontend.
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
    var range = sheet.getDataRange();
    var data = range.getValues();
    var richTexts = range.getRichTextValues();

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
      var richRow = richTexts[r];

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
      var rawCategory = getVal(row, colMap.category);
      var rawPublished = getVal(row, colMap.published);
      var rawFeatured = getVal(row, colMap.featured);
      var rawOrder = getVal(row, colMap.order);

      // Read thumbnail from Smart Chip link or cell text
      var rawThumbnail = '';
      if (colMap.thumbnail !== -1 && richRow && richRow[colMap.thumbnail]) {
        var richCell = richRow[colMap.thumbnail];
        var chipLink = richCell.getLinkUrl();
        if (chipLink && String(chipLink).trim() !== '') {
          rawThumbnail = String(chipLink).trim();
        }
      }
      if (!rawThumbnail) {
        rawThumbnail = getVal(row, colMap.thumbnail);
      }

      // 1. Central YouTube URL Parsing
      var parsedUrl = parseYouTubeUrl(url);
      var contentType = resolveContentType(rawType, parsedUrl.contentType);
      var videoId = parsedUrl.videoId;
      var playlistId = parsedUrl.playlistId;

      // 2. Resolve Thumbnail (Drive CDN or standard YouTube thumbnail)
      var customDriveThumb = resolveGoogleDriveThumbnail(rawThumbnail);
      var fallbackThumb = '';
      if (videoId) {
        fallbackThumb = 'https://i.ytimg.com/vi/' + videoId + '/hqdefault.jpg';
      }

      var finalThumbnail = customDriveThumb || fallbackThumb;
      if (!finalThumbnail && contentType === 'playlist' && playlistId) {
        // Query YouTube oEmbed for playlist thumbnail fallback
        try {
          var oUrl = 'https://www.youtube.com/oembed?url=' + encodeURIComponent('https://www.youtube.com/playlist?list=' + playlistId) + '&format=json';
          var oRes = UrlFetchApp.fetch(oUrl, { muteHttpExceptions: true });
          if (oRes.getResponseCode() === 200) {
            var oData = JSON.parse(oRes.getContentText());
            if (oData && oData.thumbnail_url) {
              fallbackThumb = oData.thumbnail_url;
              finalThumbnail = fallbackThumb;
            }
          }
        } catch (e) {}
      }

      // 3. Resolve Title
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

      // 4. Check Published Status (default true unless explicitly marked FALSE/0/NO/DRAFT)
      var isPublished = true;
      if (rawPublished !== undefined && rawPublished !== null && String(rawPublished).trim() !== '') {
        var pubStr = String(rawPublished).trim().toLowerCase();
        if (pubStr === 'false' || pubStr === '0' || pubStr === 'no' || pubStr === 'draft') {
          isPublished = false;
        }
      }

      // 5. Check Featured Status
      var isFeatured = false;
      if (rawFeatured !== undefined && rawFeatured !== null && String(rawFeatured).trim() !== '') {
        var featStr = String(rawFeatured).trim().toLowerCase();
        if (featStr === 'true' || featStr === '1' || featStr === 'yes') {
          isFeatured = true;
        }
      }

      // 6. Category
      var category = rawCategory ? String(rawCategory).trim() : 'Programming';

      // 7. Display Order
      var displayOrder = parseInt(rawOrder, 10);
      if (isNaN(displayOrder)) {
        displayOrder = r;
      }

      var item = {
        id: 'yt_' + (videoId || playlistId || r),
        contentType: contentType,
        youtubeUrl: parsedUrl.externalUrl || url,
        youtubeId: videoId || playlistId || '',
        playlistId: playlistId || undefined,
        title: title,
        description: description ? String(description).trim() : '',
        category: category,
        thumbnailUrl: finalThumbnail,
        customThumbnailUrl: customDriveThumb || undefined,
        fallbackThumbnailUrl: fallbackThumb || undefined,
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
 * Map header columns dynamically with strict priority ordering
 */
function mapHeaders(headerRow) {
  var map = {
    date: -1,
    url: -1,
    description: -1,
    thumbnail: -1,
    title: -1,
    type: -1,
    category: -1,
    published: -1,
    featured: -1,
    order: -1,
  };

  for (var i = 0; i < headerRow.length; i++) {
    var h = String(headerRow[i] || '').toLowerCase().replace(/\s+/g, ' ').trim();

    // Check THUMBNAIL first to prevent "thumbnail drive link" from matching URL!
    if (
      h.indexOf('thumb') !== -1 ||
      h.indexOf('drive link') !== -1 ||
      h.indexOf('poster') !== -1 ||
      h === 'image' ||
      h.indexOf('thumbnail drive link') !== -1
    ) {
      map.thumbnail = i;
    } else if (
      h.indexOf('youtube') !== -1 ||
      h.indexOf('video link') !== -1 ||
      h.indexOf('playlist link') !== -1 ||
      h.indexOf('shorts link') !== -1 ||
      h.indexOf('link of youtube') !== -1 ||
      h === 'link' ||
      h === 'url'
    ) {
      map.url = i;
    } else if (h.indexOf('date') !== -1 || h.indexOf('upload') !== -1) {
      map.date = i;
    } else if (h.indexOf('desc') !== -1) {
      map.description = i;
    } else if (h === 'title' || h.indexOf('title') !== -1 || h === 'name') {
      map.title = i;
    } else if (h === 'type' || h.indexOf('content type') !== -1) {
      map.type = i;
    } else if (h.indexOf('cat') !== -1 || h.indexOf('tag') !== -1) {
      map.category = i;
    } else if (h.indexOf('pub') !== -1 || h.indexOf('visible') !== -1 || h.indexOf('status') !== -1) {
      map.published = i;
    } else if (h.indexOf('feat') !== -1 || h.indexOf('star') !== -1 || h.indexOf('highlight') !== -1) {
      map.featured = i;
    } else if (h.indexOf('order') !== -1 || h.indexOf('index') !== -1 || h.indexOf('sno') !== -1) {
      map.order = i;
    }
  }

  // Fallbacks if positional
  if (map.date === -1 && headerRow.length > 0) map.date = 0;
  if (map.url === -1 && headerRow.length > 1) map.url = 1;
  if (map.description === -1 && headerRow.length > 2) map.description = 2;
  if (map.thumbnail === -1 && headerRow.length > 3) map.thumbnail = 3;

  return map;
}

function getVal(row, colIndex) {
  if (colIndex === -1 || colIndex === undefined || colIndex >= row.length) {
    return '';
  }
  return row[colIndex];
}

/**
 * Robust Central YouTube URL Parser in Apps Script
 */
function parseYouTubeUrl(url) {
  var str = String(url || '').trim();
  var contentType = 'video';
  var videoId = null;
  var playlistId = null;

  var pMatch = str.match(/[?&]list=([a-zA-Z0-9_-]+)/i) || str.match(/\/playlist\/([a-zA-Z0-9_-]+)/i);
  if (pMatch) {
    playlistId = pMatch[1];
    contentType = 'playlist';
  }

  var sMatch = str.match(/\/shorts\/([a-zA-Z0-9_-]{11})/i);
  if (sMatch) {
    videoId = sMatch[1];
    contentType = 'short';
  }

  if (!videoId) {
    var vMatch = str.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
    if (vMatch) {
      videoId = vMatch[1];
      if (!pMatch) contentType = 'video';
    }
  }

  if (!videoId && !playlistId) {
    if (/^[a-zA-Z0-9_-]{11}$/.test(str)) {
      videoId = str;
    } else if (/^(?:PL|UU|LL|FL|RD|OLAK5uy_)[a-zA-Z0-9_-]+$/.test(str)) {
      playlistId = str;
      contentType = 'playlist';
    }
  }

  var externalUrl = str;
  if (str.indexOf('http://') !== 0 && str.indexOf('https://') !== 0) {
    if (contentType === 'playlist' && playlistId) {
      externalUrl = 'https://www.youtube.com/playlist?list=' + playlistId;
    } else if (contentType === 'short' && videoId) {
      externalUrl = 'https://www.youtube.com/shorts/' + videoId;
    } else if (videoId) {
      externalUrl = 'https://www.youtube.com/watch?v=' + videoId;
    }
  }

  return {
    contentType: contentType,
    videoId: videoId,
    playlistId: playlistId,
    externalUrl: externalUrl,
  };
}

function resolveContentType(rawType, parsedType) {
  if (rawType && String(rawType).trim() !== '') {
    var t = String(rawType).trim().toLowerCase();
    if (t.indexOf('short') !== -1) return 'short';
    if (t.indexOf('play') !== -1 || t.indexOf('series') !== -1) return 'playlist';
    if (t.indexOf('vid') !== -1) return 'video';
  }
  return parsedType || 'video';
}

/**
 * Resolve Google Drive Thumbnail URL
 */
function resolveGoogleDriveThumbnail(rawThumbnail) {
  if (!rawThumbnail || String(rawThumbnail).trim() === '') return null;
  var str = String(rawThumbnail).trim();

  var driveMatch =
    str.match(/(?:id=|\/d\/|\/file\/d\/)([a-zA-Z0-9_-]{20,})/i) ||
    str.match(/google\.com\/.*?[\?&]id=([a-zA-Z0-9_-]{20,})/i) ||
    str.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]{20,})/i);

  if (driveMatch && driveMatch[1]) {
    return 'https://drive.google.com/thumbnail?id=' + driveMatch[1] + '&sz=w1280';
  }

  if (/^[a-zA-Z0-9_-]{25,}$/.test(str)) {
    return 'https://drive.google.com/thumbnail?id=' + str + '&sz=w1280';
  }

  if (str.indexOf('http://') === 0 || str.indexOf('https://') === 0) {
    return str;
  }

  return null;
}

/**
 * Create JSON TextOutput response
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}
