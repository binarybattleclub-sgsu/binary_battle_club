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
                  process.env.SHEETDB_API_URL || env.SHEETDB_API_URL || 'https://sheetdb.io/api/v1/9plr44lrtzu9u';
                const targetTab = process.env.SHEETDB_TARGET_TAB || env.SHEETDB_TARGET_TAB || 'Applied Members';
                const bearerToken = process.env.SHEETDB_BEARER_TOKEN || env.SHEETDB_BEARER_TOKEN || '';

                const sheetDbUrl = `${sheetDbBaseUrl.replace(/\/+$/, '')}?sheet=${encodeURIComponent(targetTab)}`;

                const sheetDbPayload = {
                  data: [
                    {
                      'Name': fullName,
                      'Full Name': fullName,
                      'University Email': email,
                      'Email': email,
                      'Enrollment Number': studentId,
                      'Student ID / Enrollment Number': studentId,
                      'Department': schoolDepartment,
                      'School / Department': schoolDepartment,
                      'Current Semester': semester,
                      'Notes': reasonToJoin,
                      'Why do you want to join Binary Battle Club?': reasonToJoin,
                      'Application Date': formattedDate,
                      'Timestamp': formattedDate,
                      'Application Status': 'Pending',
                    },
                  ],
                  return_values: true,
                };

                const headers: Record<string, string> = {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                };
                if (bearerToken && bearerToken.trim() !== '') {
                  headers['Authorization'] = `Bearer ${bearerToken.trim()}`;
                }

                const sheetDbRes = await fetch(sheetDbUrl, {
                  method: 'POST',
                  headers,
                  body: JSON.stringify(sheetDbPayload),
                });

                const sheetDbText = await sheetDbRes.text();
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

                // If SheetDB fails due to empty Row 1 in sheet
                const isEmptyHeader = typeof sheetDbText === 'string' && sheetDbText.includes('Spreadsheet is empty');
                const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL || env.GOOGLE_APPS_SCRIPT_URL;

                // Technical fallback if SheetDB is blocked by sheet layout
                if (isEmptyHeader && appsScriptUrl && appsScriptUrl.startsWith('http')) {
                  const gasRes = await fetch(appsScriptUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      fullName,
                      email,
                      studentId,
                      schoolDepartment,
                      semester,
                      reasonToJoin,
                      authToken: process.env.GOOGLE_APPS_SCRIPT_SECRET || env.GOOGLE_APPS_SCRIPT_SECRET || '',
                    }),
                    redirect: 'follow',
                  });
                  const gasJson = await gasRes.json();
                  if (gasJson.status === 'success') {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({
                      success: true,
                      message: 'Application recorded successfully in Applied Members tab.',
                      timestamp: gasJson.timestamp || formattedDate,
                      method: 'Google Apps Script (Dashboard Preserved)',
                    }));
                    return;
                  }
                }

                if (isEmptyHeader) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    success: false,
                    error:
                      'SheetDB Error: Row 1 of "Applied Members" is empty. SheetDB requires column headers in Row 1. Row 10 headers are not accessible by SheetDB until moved to Row 1.',
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
        },
      },
    ],
    server: {
      port: 3000,
      open: false,
    },
  };
});
