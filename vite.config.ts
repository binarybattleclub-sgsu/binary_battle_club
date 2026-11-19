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
          server.middlewares.use('/api/join', (req, res, next) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Method Not Allowed' }));
              return;
            }

            let bodyStr = '';
            req.on('data', (chunk) => {
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

                // 3. Check for configured Google Apps Script Webhook URL
                const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL || env.GOOGLE_APPS_SCRIPT_URL;

                if (!scriptUrl || !scriptUrl.startsWith('http')) {
                  res.statusCode = 503;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    success: false,
                    error:
                      'GOOGLE_APPS_SCRIPT_URL is not configured. Please add your deployed Google Apps Script Web App URL to your .env file.',
                  }));
                  return;
                }

                // 4. Forward to Google Apps Script
                const forwardRes = await fetch(scriptUrl, {
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

                const scriptData = await forwardRes.json();

                if (scriptData.status !== 'success') {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    success: false,
                    error: scriptData.message || 'Spreadsheet rejected submission.',
                  }));
                  return;
                }

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  success: true,
                  message: 'Application recorded successfully in Google Sheets.',
                  timestamp: scriptData.timestamp || new Date().toISOString(),
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
