/**
 * Netlify Function: /.netlify/functions/join
 * Secure SheetDB integration for Binary Battle Club Join Form.
 */

interface ApplicationPayload {
  fullName: string;
  email: string;
  studentId: string;
  schoolDepartment: string;
  semester: string;
  reasonToJoin: string;
  website?: string;
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

    const sheetDbBaseUrl =
      process.env.SHEETDB_API_URL || 'https://sheetdb.io/api/v1/9plr44lrtzu9u';
    const targetTab = process.env.SHEETDB_TARGET_TAB || 'Applied Members';
    const bearerToken = process.env.SHEETDB_BEARER_TOKEN || '';

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

    const sheetDbUrl = `${sheetDbBaseUrl.replace(/\/+$/, '')}?sheet=${encodeURIComponent(targetTab)}`;

    const sheetDbPayload = {
      data: [
        {
          'Name': fullName,
          'University Email': email,
          'Enrollment Number': studentId,
          'Department': schoolDepartment,
          'Current Semester': semester,
          'Notes': reasonToJoin,
          'Application Date': formattedDate,
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

    const response = await fetch(sheetDbUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(sheetDbPayload),
    });

    const resStatus = response.status;
    const resText = await response.text();

    if (resStatus === 201 || resStatus === 200) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: true,
          message: 'Application recorded successfully in Google Sheets via SheetDB.',
          timestamp: formattedDate,
          method: 'SheetDB',
        }),
      };
    }

    return {
      statusCode: resStatus >= 400 && resStatus < 500 ? resStatus : 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: resText || 'SheetDB rejected submission.',
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
