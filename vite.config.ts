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
