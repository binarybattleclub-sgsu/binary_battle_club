/**
 * Vercel Serverless Function: /api/join-application
 * Secure SheetDB integration for Binary Battle Club Join Form.
 */

interface ApplicationPayload {
  fullName: string;
  email: string;
  studentId: string;
  schoolDepartment: string;
  semester: string;
  reasonToJoin: string;
  website?: string; // Honeypot
}

// In-memory rate limiting map: IP -> array of timestamps
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
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

    // 4. Retrieve SheetDB Configuration from Server Environment
    const sheetDbBaseUrl =
      process.env.SHEETDB_API_URL || 'https://sheetdb.io/api/v1/l9o1tgz8oojky';
    const targetTab = process.env.SHEETDB_TARGET_TAB || 'Applied Members';
    const bearerToken = process.env.SHEETDB_BEARER_TOKEN || '';

    // Auto-generate timestamp (IST / Asia/Kolkata)
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

    // Prepare SheetDB POST payload matching verified spreadsheet column headers
    // Includes both clean keys and current spreadsheet keys (spaces/typo tolerant)
    const recordPayload = {
      // Clean target columns
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

    // 5. Execute SheetDB Create API
    // Attempt with ?sheet=Applied%20Members first; fallback to root if SheetDB cached 'Sheet1'
    let sheetDbUrl = `${sheetDbBaseUrl.replace(/\/+$/, '')}?sheet=${encodeURIComponent(targetTab)}`;
    let sheetDbResponse = await fetch(sheetDbUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(sheetDbPayload),
    });

    let responseStatus = sheetDbResponse.status;
    let responseText = await sheetDbResponse.text();

    if (responseStatus === 404 || responseText.includes('Sheet not found')) {
      console.warn(`[API /api/join-application] Tab "${targetTab}" not recognized by SheetDB cache. Retrying default first sheet...`);
      sheetDbUrl = sheetDbBaseUrl.replace(/\/+$/, '');
      sheetDbResponse = await fetch(sheetDbUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(sheetDbPayload),
      });
      responseStatus = sheetDbResponse.status;
      responseText = await sheetDbResponse.text();
    }

    let responseData: any = null;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    // 6. Check SheetDB result
    if (responseStatus === 201 || (responseStatus === 200 && (responseData?.created === 1 || Array.isArray(responseData)))) {
      return res.status(200).json({
        success: true,
        message: 'Application recorded successfully in Google Sheets via SheetDB.',
        timestamp: formattedDate,
        method: 'SheetDB',
      });
    }

    // 7. Investigate & handle SheetDB error
    console.error(`[API /api/join-application] SheetDB HTTP ${responseStatus}:`, responseText);

    if (responseStatus === 401 || responseText.includes('permission')) {
      return res.status(401).json({
        success: false,
        error:
          'Google Spreadsheet Permission Error: SheetDB was denied write access. Please set the Google Spreadsheet sharing settings to "Editor" for Anyone with the link, or verify CREATE permission in your SheetDB dashboard.',
        detail: responseData?.error || responseText,
      });
    }

    const isEmptyHeaderError =
      typeof responseText === 'string' &&
      responseText.toLowerCase().includes('spreadsheet is empty');

    if (isEmptyHeaderError) {
      return res.status(400).json({
        success: false,
        error:
          'Spreadsheet structure error: Row 1 of "Applied Members" does not contain table column headers. SheetDB requires column headers in Row 1. Please place column headers in Row 1.',
        detail: responseData?.error || responseText,
      });
    }

    return res.status(responseStatus >= 400 && responseStatus < 500 ? responseStatus : 502).json({
      success: false,
      error: responseData?.error || 'SheetDB rejected submission. Please verify API permissions.',
      detail: responseData,
    });

  } catch (error: any) {
    console.error('[API /api/join-application] Unhandled error:', error?.message || error);
    return res.status(500).json({
      success: false,
      error: 'An internal error occurred while transmitting your application. Please try again.',
    });
  }
}
