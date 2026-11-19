/**
 * Vercel Serverless Function: /api/join
 * Handles secure submission forwarding to Google Apps Script.
 */

interface ApplicationPayload {
  fullName: string;
  email: string;
  studentId: string;
  schoolDepartment: string;
  semester: string;
  reasonToJoin: string;
  website?: string; // Honeypot
  authToken?: string;
}

// In-memory rate limiting map: IP -> array of timestamps
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  
  // Filter out timestamps outside the active window
  const activeTimestamps = timestamps.filter((time) => now - time < RATE_LIMIT_WINDOW_MS);
  
  if (activeTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    rateLimitMap.set(ip, activeTimestamps);
    return true;
  }
  
  activeTimestamps.push(now);
  rateLimitMap.set(ip, activeTimestamps);
  return false;
}

export default async function handler(req: any, res: any) {
  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed. Only POST requests are supported.',
    });
  }

  // 1. IP Rate Limiting
  const clientIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'anonymous';

  if (isRateLimited(clientIp)) {
    return res.status(429).json({
      success: false,
      error: 'Too many submissions from your connection. Please wait 15 minutes before trying again.',
    });
  }

  try {
    const body: ApplicationPayload =
      typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};

    // 2. Honeypot check (anti-spam)
    if (body.website && body.website.trim() !== '') {
      // Silently discard spam without contacting Google Sheets
      return res.status(200).json({
        success: true,
        message: 'Application received and processed.',
      });
    }

    // 3. Server-side validation of all 6 required fields
    const fullName = (body.fullName || '').trim();
    const email = (body.email || '').trim();
    const studentId = (body.studentId || '').trim();
    const schoolDepartment = (body.schoolDepartment || '').trim();
    const semester = (body.semester || '').trim();
    const reasonToJoin = (body.reasonToJoin || '').trim();

    if (!fullName) {
      return res.status(400).json({ success: false, error: 'Full Name is required.' });
    }
    if (fullName.length > 100) {
      return res.status(400).json({ success: false, error: 'Full Name must not exceed 100 characters.' });
    }

    if (!email) {
      return res.status(400).json({ success: false, error: 'University Email is required.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid university email address.' });
    }

    if (!studentId) {
      return res.status(400).json({ success: false, error: 'Student ID / Enrollment Number is required.' });
    }

    if (!schoolDepartment) {
      return res.status(400).json({ success: false, error: 'School / Department is required.' });
    }

    if (!semester) {
      return res.status(400).json({ success: false, error: 'Current Semester is required.' });
    }

    if (!reasonToJoin) {
      return res.status(400).json({ success: false, error: 'Motivation response is required.' });
    }
    if (reasonToJoin.length < 15) {
      return res.status(400).json({
        success: false,
        error: 'Please describe why you want to join Binary Battle Club (minimum 15 characters).',
      });
    }

    // 4. Retrieve Google Apps Script Webhook URL from server environment
    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (!appsScriptUrl || !appsScriptUrl.startsWith('http')) {
      console.error('[API /api/join] Missing GOOGLE_APPS_SCRIPT_URL environment variable.');
      return res.status(503).json({
        success: false,
        error:
          'Application submission service is temporarily not configured. Please ensure GOOGLE_APPS_SCRIPT_URL is set in environment variables.',
      });
    }

    // 5. Forward validated payload to Google Apps Script
    const forwardPayload = {
      fullName,
      email,
      studentId,
      schoolDepartment,
      semester,
      reasonToJoin,
      authToken: process.env.GOOGLE_APPS_SCRIPT_SECRET || '',
    };

    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(forwardPayload),
      redirect: 'follow', // Essential for Google Apps Script 302 redirects
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[API /api/join] Apps Script responded with HTTP ${response.status}:`, errText);
      return res.status(502).json({
        success: false,
        error: 'Spreadsheet service error. Please try again shortly.',
      });
    }

    const scriptResult = await response.json();

    if (scriptResult.status !== 'success') {
      console.error('[API /api/join] Apps Script returned non-success:', scriptResult.message);
      return res.status(400).json({
        success: false,
        error: scriptResult.message || 'Submission could not be recorded in the spreadsheet.',
      });
    }

    // 6. Return confirmed success response (never exposing private spreadsheet URLs)
    return res.status(200).json({
      success: true,
      message: 'Application recorded successfully in Binary Battle Club records.',
      timestamp: scriptResult.timestamp || new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[API /api/join] Unhandled exception:', error?.message || error);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred while transmitting your application. Please try again.',
    });
  }
}
