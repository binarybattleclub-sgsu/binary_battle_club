import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'api-join-dev-middleware',
        configureServer(server) {
          const handleJoinRequest = (req: any, res: any) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Method Not Allowed' }));
              return;
            }

            let bodyStr = '';
            req.on('data', (chunk: any) => {
              bodyStr += chunk;
            });

            req.on('end', async () => {
              try {
                const body = JSON.parse(bodyStr || '{}');

                // 1. Honeypot check
                if (body.website && body.website.trim() !== '') {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true, message: 'Application processed.' }));
                  return;
                }

                // 2. Required fields validation
                const fullName = (body.fullName || '').trim();
                const email = (body.email || '').trim();
                const studentId = (body.studentId || '').trim();
                const schoolDepartment = (body.schoolDepartment || '').trim();
                const semester = (body.semester || '').trim();
                const reasonToJoin = (body.reasonToJoin || '').trim();

                if (!fullName || !email || !studentId || !schoolDepartment || !semester || !reasonToJoin) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: 'All 6 fields are required.' }));
                  return;
                }

                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: 'Please enter a valid university email address.' }));
                  return;
                }

                if (reasonToJoin.length < 15) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    success: false,
                    error: 'Motivation response must be at least 15 characters.',
                  }));
                  return;
                }

                // 3. Format Date/Timestamp
                const now = new Date();
                const formattedDate = now.toLocaleString('en-IN', {
                  timeZone: 'Asia/Kolkata',
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                }).replace(/[/]/g, '-');

                // 4. Try SheetDB Create API
                const sheetDbBaseUrl =
                  process.env.SHEETDB_API_URL || env.SHEETDB_API_URL || 'https://sheetdb.io/api/v1/l9o1tgz8oojky';
                const targetTab = process.env.SHEETDB_TARGET_TAB || env.SHEETDB_TARGET_TAB || 'Applied Members';
                const bearerToken = process.env.SHEETDB_BEARER_TOKEN || env.SHEETDB_BEARER_TOKEN || '';

                const recordPayload = {
                  'Timestamp': formattedDate,
                  'Full Name': fullName,
                  'University Email': email,
                  'Student ID / Enrollment Number': studentId,
                  'School / Department': schoolDepartment,
                  'Current Semester': semester,
                  'Motivation': reasonToJoin,

                  // Tolerant mapping for current Google Sheet headers (with trailing/leading spaces or typos)
                  'Timestamp        ': formattedDate,
                  '   Full Name  ': fullName,
                  '  University Email    ': email,
                  '    Student ID / Enrollment Number    ': studentId,
                  ' Current Semeste': semester,

                  // Legacy aliases
                  'Name': fullName,
                  'Email': email,
                  'Enrollment Number': studentId,
                  'Department': schoolDepartment,
                  'Notes': reasonToJoin,
                  'Why do you want to join Binary Battle Club?': reasonToJoin,
                  'Application Date': formattedDate,
                  'Application Status': 'Pending',
                };

                const sheetDbPayload = {
                  data: [recordPayload],
                  return_values: true,
                };

                const headers: Record<string, string> = {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                };
                if (bearerToken && bearerToken.trim() !== '') {
                  headers['Authorization'] = `Bearer ${bearerToken.trim()}`;
                }

                let sheetDbUrl = `${sheetDbBaseUrl.replace(/\/+$/, '')}?sheet=${encodeURIComponent(targetTab)}`;
                let sheetDbRes = await fetch(sheetDbUrl, {
                  method: 'POST',
                  headers,
                  body: JSON.stringify(sheetDbPayload),
                });

                let sheetDbText = await sheetDbRes.text();

                if (sheetDbRes.status === 404 || sheetDbText.includes('Sheet not found')) {
                  sheetDbUrl = sheetDbBaseUrl.replace(/\/+$/, '');
                  sheetDbRes = await fetch(sheetDbUrl, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(sheetDbPayload),
                  });
                  sheetDbText = await sheetDbRes.text();
                }

                let sheetDbJson: any = null;
                try {
                  sheetDbJson = JSON.parse(sheetDbText);
                } catch {}

                if (sheetDbRes.status === 201 || (sheetDbRes.status === 200 && (sheetDbJson?.created === 1 || Array.isArray(sheetDbJson)))) {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    success: true,
                    message: 'Application recorded successfully in Google Sheets via SheetDB.',
                    timestamp: formattedDate,
                    method: 'SheetDB',
                  }));
                  return;
                }

                if (sheetDbRes.status === 401 || sheetDbText.includes('permission')) {
                  res.statusCode = 401;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    success: false,
                    error:
                      'Google Spreadsheet Permission Error: SheetDB was denied write access. Please set the Google Spreadsheet sharing settings to "Editor" for Anyone with the link, or verify CREATE permission in your SheetDB dashboard.',
                    detail: sheetDbText,
                  }));
                  return;
                }

                // If SheetDB fails due to empty Row 1 in sheet
                const isEmptyHeader = typeof sheetDbText === 'string' && sheetDbText.includes('Spreadsheet is empty');

                if (isEmptyHeader) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    success: false,
                    error:
                      'SheetDB Error: Row 1 of "Applied Members" does not contain table column headers. SheetDB requires column headers in Row 1 (A1: Sno., B1: Name, C1: University Email, etc.).',
                    detail: sheetDbText,
                  }));
                  return;
                }

                res.statusCode = sheetDbRes.status >= 400 && sheetDbRes.status < 500 ? sheetDbRes.status : 502;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  success: false,
                  error: sheetDbJson?.error || 'SheetDB rejected submission.',
                  detail: sheetDbText,
                }));
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  success: false,
                  error: err.message || 'Internal server error while processing application.',
                }));
              }
            });
          };

          // Register for both /api/join-application and /api/join
          server.middlewares.use('/api/join-application', handleJoinRequest);
          server.middlewares.use('/api/join', handleJoinRequest);

          // Register for /api/explore-share and /api/explore-share/image
          server.middlewares.use(async (req: any, res: any, next: any) => {
            const url = req.url || '';
            if (url.startsWith('/api/explore-share/image/') || url.startsWith('/api/explore-share-image')) {
              const fileId =
                url.split('/image/')[1]?.split('?')[0] ||
                url.split('fileId=')[1]?.split('&')[0];

              if (!fileId || !/^[a-zA-Z0-9_-]+$/.test(fileId)) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Invalid or missing fileId parameter' }));
                return;
              }

              try {
                // Fetch image from Google Drive CDN
                const cdnUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
                const cdnRes = await fetch(cdnUrl);
                if (cdnRes.ok) {
                  res.setHeader('Content-Type', cdnRes.headers.get('content-type') || 'image/jpeg');
                  res.setHeader('Cache-Control', 'public, max-age=86400');
                  const ab = await cdnRes.arrayBuffer();
                  res.end(Buffer.from(ab));
                  return;
                }
                const ucUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
                const ucRes = await fetch(ucUrl);
                if (ucRes.ok) {
                  res.setHeader('Content-Type', ucRes.headers.get('content-type') || 'image/jpeg');
                  res.setHeader('Cache-Control', 'public, max-age=86400');
                  const ab = await ucRes.arrayBuffer();
                  res.end(Buffer.from(ab));
                  return;
                }
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Image not found' }));
              } catch (e: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: e.message }));
              }
              return;
            }

            if (url === '/api/explore-share' || url.startsWith('/api/explore-share?')) {
              try {
                const spreadsheetId =
                  process.env.GOOGLE_SPREADSHEET_ID ||
                  env.GOOGLE_SPREADSHEET_ID ||
                  '1kstAqWKgYW5HqNrtLeWGSEUcc29bCambKhwZJ-e0oEE';
                const sheetTab =
                  process.env.GOOGLE_SHEET_TAB ||
                  env.GOOGLE_SHEET_TAB ||
                  'Explore & Share';
                const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
                  sheetTab
                )}`;
                const cRes = await fetch(csvUrl);
                if (!cRes.ok) {
                  res.statusCode = 502;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(
                    JSON.stringify({
                      success: false,
                      error: 'Could not fetch Explore & Share spreadsheet',
                    })
                  );
                  return;
                }
                const csvText = await cRes.text();

                // Simple robust CSV line parser
                const rawLines = csvText.split(/\r?\n/).filter((l) => l.trim() !== '');
                const items: any[] = [];

                for (let i = 1; i < rawLines.length; i++) {
                  const line = rawLines[i];
                  const cells: string[] = [];
                  let cur = '';
                  let inQuote = false;
                  for (let j = 0; j < line.length; j++) {
                    const c = line[j];
                    if (c === '"') {
                      if (inQuote && line[j + 1] === '"') {
                        cur += '"';
                        j++;
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

                  const fileId = (cells[0] || '').replace(/^"|"$/g, '').trim();
                  if (!fileId) continue;

                  const hidden =
                    (cells[8] || '').replace(/^"|"$/g, '').toUpperCase() === 'TRUE';
                  if (hidden) continue;

                  items.push({
                    id: fileId,
                    driveFileId: fileId,
                    title: (cells[1] || '').replace(/^"|"$/g, '').trim() || fileId,
                    category: (cells[2] || '').replace(/^"|"$/g, '').trim() || 'Emerging Technologies',
                    author: (cells[3] || '').replace(/^"|"$/g, '').trim(),
                    description: (cells[4] || '').replace(/^"|"$/g, '').trim(),
                    sourceUrl: (cells[5] || '').replace(/^"|"$/g, '').trim(),
                    displayOrder:
                      parseInt((cells[6] || '').replace(/^"|"$/g, ''), 10) || 999,
                    featured:
                      (cells[7] || '').replace(/^"|"$/g, '').toUpperCase() === 'TRUE',
                    image: `/api/explore-share/image/${fileId}`,
                    date: 'Recent',
                  });
                }

                items.sort((a, b) => {
                  if (a.featured !== b.featured) return a.featured ? -1 : 1;
                  return a.displayOrder - b.displayOrder;
                });

                res.setHeader('Content-Type', 'application/json');
                res.end(
                  JSON.stringify({
                    success: true,
                    count: items.length,
                    data: items,
                  })
                );
              } catch (e: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: e.message }));
              }
              return;
            }

            // Register for /api/youtube-learning
            if (url === '/api/youtube-learning' || url.startsWith('/api/youtube-learning?')) {
              try {
                const appsScriptUrl =
                  process.env.YOUTUBE_LEARNING_SCRIPT_URL ||
                  env.YOUTUBE_LEARNING_SCRIPT_URL ||
                  process.env.GOOGLE_APPS_SCRIPT_URL ||
                  env.GOOGLE_APPS_SCRIPT_URL;

                if (appsScriptUrl && appsScriptUrl.trim() !== '') {
                  try {
                    const sRes = await fetch(appsScriptUrl.trim(), {
                      headers: { Accept: 'application/json' },
                    });
                    if (sRes.ok) {
                      const sJson = await sRes.json();
                      if (sJson && Array.isArray(sJson.data)) {
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(sJson));
                        return;
                      }
                    }
                  } catch (e) {
                    // Fallback to gviz CSV
                  }
                }

                const spreadsheetId =
                  process.env.YOUTUBE_SPREADSHEET_ID ||
                  env.YOUTUBE_SPREADSHEET_ID ||
                  '1hXrejoZzSYGoWpzB5SrohZpixQrXke9A9qRbWtYBnZw';
                const sheetTab =
                  process.env.YOUTUBE_SHEET_TAB ||
                  env.YOUTUBE_SHEET_TAB ||
                  'Sheet1';
                const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(
                  sheetTab
                )}`;
                const cRes = await fetch(csvUrl);
                if (!cRes.ok) {
                  res.statusCode = 502;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(
                    JSON.stringify({
                      success: false,
                      error: 'Could not fetch YouTube Learning spreadsheet',
                    })
                  );
                  return;
                }

                const csvText = await cRes.text();
                const rawLines = csvText.split(/\r?\n/).filter((l) => l.trim() !== '');
                const rows: string[][] = [];

                for (const line of rawLines) {
                  const cells: string[] = [];
                  let cur = '';
                  let inQuote = false;
                  for (let j = 0; j < line.length; j++) {
                    const c = line[j];
                    if (c === '"') {
                      if (inQuote && line[j + 1] === '"') {
                        cur += '"';
                        j++;
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
                  rows.push(cells);
                }

                if (rows.length <= 1) {
                  res.setHeader('Content-Type', 'application/json');
                  res.end(
                    JSON.stringify({
                      success: true,
                      count: 0,
                      data: [],
                      source: 'Google Sheets (Empty)',
                    })
                  );
                  return;
                }

                const headers = rows[0].map((h) => h.toLowerCase().trim());
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

                if (colDate === -1 && headers.length > 0) colDate = 0;
                if (colUrl === -1 && headers.length > 1) colUrl = 1;
                if (colDesc === -1 && headers.length > 2) colDesc = 2;

                const items: any[] = [];

                for (let r = 1; r < rows.length; r++) {
                  const row = rows[r];
                  const rawUrl = (row[colUrl] || '').replace(/^"|"$/g, '').trim();
                  if (!rawUrl) continue;

                  const dateStr = colDate !== -1 ? (row[colDate] || '').replace(/^"|"$/g, '').trim() : '';
                  const descStr = colDesc !== -1 ? (row[colDesc] || '').replace(/^"|"$/g, '').trim() : '';
                  const titleStr = colTitle !== -1 ? (row[colTitle] || '').replace(/^"|"$/g, '').trim() : '';
                  const typeStr = colType !== -1 ? (row[colType] || '').replace(/^"|"$/g, '').trim() : '';
                  const thumbStr = colThumbnail !== -1 ? (row[colThumbnail] || '').replace(/^"|"$/g, '').trim() : '';
                  const catStr = colCategory !== -1 ? (row[colCategory] || '').replace(/^"|"$/g, '').trim() : '';
                  const pubStr = colPublished !== -1 ? (row[colPublished] || '').replace(/^"|"$/g, '').trim() : '';
                  const featStr = colFeatured !== -1 ? (row[colFeatured] || '').replace(/^"|"$/g, '').trim() : '';
                  const orderStr = colOrder !== -1 ? (row[colOrder] || '').replace(/^"|"$/g, '').trim() : '';

                  let contentType = 'video';
                  if (typeStr) {
                    const t = typeStr.toLowerCase();
                    if (t.includes('short')) contentType = 'short';
                    else if (t.includes('play') || t.includes('series')) contentType = 'playlist';
                  } else {
                    const l = rawUrl.toLowerCase();
                    if (l.includes('/shorts/')) contentType = 'short';
                    else if (l.includes('list=') || l.includes('/playlist') || l.includes('videoseries'))
                      contentType = 'playlist';
                  }

                  let videoId = '';
                  const vMatch = rawUrl.match(
                    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
                  );
                  if (vMatch) videoId = vMatch[1];
                  else if (/^[a-zA-Z0-9_-]{11}$/.test(rawUrl)) videoId = rawUrl;

                  let playlistId = '';
                  const pMatch = rawUrl.match(/[?&]list=([a-zA-Z0-9_-]+)/i) || rawUrl.match(/\/playlist\/([a-zA-Z0-9_-]+)/i);
                  if (pMatch) playlistId = pMatch[1];
                  else if (/^(?:PL|UU|LL|FL|RD|OLAK5uy_)[a-zA-Z0-9_-]+$/.test(rawUrl)) playlistId = rawUrl;

                  let thumbnailUrl = '';
                  if (thumbStr) {
                    const driveMatch = thumbStr.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]{20,})/);
                    if (driveMatch) {
                      thumbnailUrl = `https://lh3.googleusercontent.com/d/${driveMatch[1]}`;
                    } else if (thumbStr.startsWith('http')) {
                      thumbnailUrl = thumbStr;
                    }
                  }
                  if (!thumbnailUrl && videoId) {
                    thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                  }
                  if (!thumbnailUrl && contentType === 'playlist') {
                    thumbnailUrl =
                      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';
                  }

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

                  let isPublished = true;
                  if (pubStr) {
                    const lp = pubStr.toLowerCase();
                    if (lp === 'false' || lp === '0' || lp === 'no' || lp === 'draft') isPublished = false;
                  }

                  let isFeatured = false;
                  if (featStr) {
                    const lf = featStr.toLowerCase();
                    if (lf === 'true' || lf === '1' || lf === 'yes') isFeatured = true;
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

                items.sort((a, b) => {
                  if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
                  return a.displayOrder - b.displayOrder;
                });

                res.setHeader('Content-Type', 'application/json');
                res.end(
                  JSON.stringify({
                    success: true,
                    count: items.length,
                    data: items,
                    source: 'Google Sheets gviz (Local Dev)',
                  })
                );
              } catch (e: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: e.message }));
              }
              return;
            }

            next();
          });
        },
      },
    ],
    server: {
      port: 3000,
      open: false,
    },
  };
});
