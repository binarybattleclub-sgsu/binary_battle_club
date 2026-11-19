/**
 * Netlify Function: /.netlify/functions/join
 * Handles secure submission forwarding to Google Apps Script.
 */

interface ApplicationPayload {
  fullName: string;
  email: string;
  studentId: string;
  schoolDepartment: string;
  semester: string;
  reasonToJoin: string;
  website?: string;
  authToken?: string;
}

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
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

export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Method Not Allowed' }),
    };
  }

  const clientIp =
    event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    event.headers['client-ip'] ||
    'anonymous';

  if (isRateLimited(clientIp)) {
    return {
      statusCode: 429,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Too many submissions. Please wait 15 minutes before trying again.',
      }),
    };
  }

  try {
    const body: ApplicationPayload = JSON.parse(event.body || '{}');

    // Honeypot check
    if (body.website && body.website.trim() !== '') {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, message: 'Application processed.' }),
      };
    }

    // Validation
    const fullName = (body.fullName || '').trim();
    const email = (body.email || '').trim();
    const studentId = (body.studentId || '').trim();
    const schoolDepartment = (body.schoolDepartment || '').trim();
    const semester = (body.semester || '').trim();
    const reasonToJoin = (body.reasonToJoin || '').trim();

    if (!fullName || !email || !studentId || !schoolDepartment || !semester || !reasonToJoin) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'All 6 fields are required.' }),
      };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'Valid university email is required.' }),
      };
    }

    if (reasonToJoin.length < 15) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Please describe why you want to join Binary Battle Club (at least 15 characters).',
        }),
      };
    }

    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!appsScriptUrl || !appsScriptUrl.startsWith('http')) {
      return {
        statusCode: 503,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'GOOGLE_APPS_SCRIPT_URL environment variable is not configured on the server.',
        }),
      };
    }

    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName,
        email,
        studentId,
        schoolDepartment,
        semester,
        reasonToJoin,
        authToken: process.env.GOOGLE_APPS_SCRIPT_SECRET || '',
      }),
      redirect: 'follow',
    });

    const scriptResult = await response.json();
    if (scriptResult.status !== 'success') {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: scriptResult.message || 'Spreadsheet update failed.',
        }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Application recorded successfully in Google Sheets.',
        timestamp: scriptResult.timestamp || new Date().toISOString(),
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: error.message || 'Internal server error while processing application.',
      }),
    };
  }
};
