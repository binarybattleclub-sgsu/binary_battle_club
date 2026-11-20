import type { IncomingMessage, ServerResponse } from 'http';
import crypto from 'crypto';

interface ExploreShareItem {
  id: string;
  driveFileId: string;
  title: string;
  category: string;
  author: string;
  description: string;
  sourceUrl: string;
  displayOrder: number;
  featured: boolean;
  image: string;
  date: string;
}

// In-memory cache
let cachedGallery: { data: ExploreShareItem[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes

// Generate OAuth access token using Service Account JSON via pure Node.js crypto
async function getServiceAccountAccessToken(serviceAccountJson: string): Promise<string | null> {
  try {
    const creds = JSON.parse(serviceAccountJson);
    if (!creds.client_email || !creds.private_key) return null;

    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const claimSet = {
      iss: creds.client_email,
      scope: 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/spreadsheets.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    };

    const base64Url = (obj: any) =>
      Buffer.from(JSON.stringify(obj))
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    const encodedHeader = base64Url(header);
    const encodedClaimSet = base64Url(claimSet);
    const signatureInput = `${encodedHeader}.${encodedClaimSet}`;

    const signer = crypto.createSign('RSA-SHA256');
    signer.update(signatureInput);
    const signature = signer
      .sign(creds.private_key, 'base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    const jwt = `${signatureInput}.${signature}`;

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    });

    if (!tokenRes.ok) {
      console.warn('[Explore & Share] Service Account token exchange failed:', await tokenRes.text());
      return null;
    }

    const tokenData = await tokenRes.json();
    return tokenData.access_token || null;
  } catch (err: any) {
    console.warn('[Explore & Share] Service account error:', err.message);
    return null;
  }
}

// Parse CSV with support for escaped commas and quotes
function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  const rawLines = text.split(/\r?\n/).filter((l) => l.trim() !== '');

  for (const line of rawLines) {
    const cells: string[] = [];
    let cur = '';
    let inQuote = false;

    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuote && line[i + 1] === '"') {
          cur += '"';
          i++;
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
    lines.push(cells);
  }
  return lines;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  // Set Cache Control for public caching and edge CDN
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=120, stale-while-revalidate=300'
  );

  const now = Date.now();
  if (cachedGallery && now - cachedGallery.timestamp < CACHE_TTL_MS) {
    return res.status(200).json({
      success: true,
      count: cachedGallery.data.length,
      data: cachedGallery.data,
      cached: true,
    });
  }

  const rootFolderId =
    process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID || '1YzLVhO8rI4vD9YVZGxgyZ1bgQdcD8pMq';
  const spreadsheetId =
    process.env.GOOGLE_SPREADSHEET_ID || '1kstAqWKgYW5HqNrtLeWGSEUcc29bCambKhwZJ-e0oEE';
  const sheetTab = process.env.GOOGLE_SHEET_TAB || 'Explore & Share';
  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  try {
    let accessToken: string | null = null;
    if (serviceAccountJson && serviceAccountJson.trim() !== '') {
      accessToken = await getServiceAccountAccessToken(serviceAccountJson);
    }

    // 1. Fetch metadata from Google Sheets
    interface SheetRowMeta {
      driveFileId: string;
      title: string;
      category: string;
      author: string;
      description: string;
      sourceUrl: string;
      displayOrder: number;
      featured: boolean;
      hidden: boolean;
    }
    const sheetMetaMap = new Map<string, SheetRowMeta>();

    if (accessToken) {
      // Authenticated Google Sheets API v4
      const range = encodeURIComponent(`${sheetTab}!A2:I`);
      const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;
      const sRes = await fetch(sheetsUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (sRes.ok) {
        const sData = await sRes.json();
        const rows: string[][] = sData.values || [];
        for (const row of rows) {
          const fileId = (row[0] || '').trim();
          if (!fileId) continue;
          sheetMetaMap.set(fileId, {
            driveFileId: fileId,
            title: (row[1] || '').trim(),
            category: (row[2] || '').trim(),
            author: (row[3] || '').trim(),
            description: (row[4] || '').trim(),
            sourceUrl: (row[5] || '').trim(),
            displayOrder: parseInt(row[6], 10) || 999,
            featured: (row[7] || '').toUpperCase() === 'TRUE',
            hidden: (row[8] || '').toUpperCase() === 'TRUE',
          });
        }
      }
    } else {
      // Public Google Sheets CSV Export
      const csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetTab)}`;
      const cRes = await fetch(csvUrl);
      if (cRes.ok) {
        const csvText = await cRes.text();
        const rows = parseCSV(csvText);
        // Skip header row
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          const fileId = (row[0] || '').replace(/^"|"$/g, '').trim();
          if (!fileId) continue;
          sheetMetaMap.set(fileId, {
            driveFileId: fileId,
            title: (row[1] || '').replace(/^"|"$/g, '').trim(),
            category: (row[2] || '').replace(/^"|"$/g, '').trim(),
            author: (row[3] || '').replace(/^"|"$/g, '').trim(),
            description: (row[4] || '').replace(/^"|"$/g, '').trim(),
            sourceUrl: (row[5] || '').replace(/^"|"$/g, '').trim(),
            displayOrder: parseInt((row[6] || '').replace(/^"|"$/g, ''), 10) || 999,
            featured: (row[7] || '').replace(/^"|"$/g, '').toUpperCase() === 'TRUE',
            hidden: (row[8] || '').replace(/^"|"$/g, '').toUpperCase() === 'TRUE',
          });
        }
      }
    }

    // 2. Discover Drive images
    interface DriveFileItem {
      id: string;
      name: string;
      mimeType: string;
      createdTime?: string;
      category?: string;
    }
    let driveFiles: DriveFileItem[] = [];

    if (accessToken) {
      // Step A: Find "Published" folder inside root
      const findPublishedUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
        `'${rootFolderId}' in parents and name = 'Published' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
      )}&fields=files(id,name)`;
      const pubRes = await fetch(findPublishedUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const pubData = await pubRes.json();
      const publishedFolderId = pubData.files?.[0]?.id || rootFolderId;

      // Step B: Discover category subfolders inside "Published"
      const findCatsUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
        `'${publishedFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
      )}&fields=files(id,name)`;
      const catsRes = await fetch(findCatsUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const catsData = await catsRes.json();
      const categoryFolders: { id: string; name: string }[] = catsData.files || [];

      // Map parent folder ID to category name
      const parentToCategory = new Map<string, string>();
      parentToCategory.set(publishedFolderId, 'All');
      for (const cat of categoryFolders) {
        parentToCategory.set(cat.id, cat.name);
      }

      // Step C: List images inside Published and category subfolders
      const folderIdsToScan = [publishedFolderId, ...categoryFolders.map((c) => c.id)];
      const parentsQuery = folderIdsToScan.map((fid) => `'${fid}' in parents`).join(' or ');
      const query = `(${parentsQuery}) and mimeType contains 'image/' and trashed = false`;

      const filesUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
        query
      )}&fields=files(id,name,mimeType,parents,createdTime)&pageSize=100`;
      const fRes = await fetch(filesUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (fRes.ok) {
        const fData = await fRes.json();
        const rawFiles = fData.files || [];
        for (const rf of rawFiles) {
          const parentId = rf.parents?.[0] || publishedFolderId;
          const categoryName = parentToCategory.get(parentId) || 'Emerging Technologies';
          driveFiles.push({
            id: rf.id,
            name: rf.name,
            mimeType: rf.mimeType,
            createdTime: rf.createdTime,
            category: categoryName,
          });
        }
      }
    } else {
      // When Service Account is pending, build items from the verified Spreadsheet metadata
      // Each row in the spreadsheet specifies an active published Drive File ID
      for (const [fileId, meta] of sheetMetaMap.entries()) {
        driveFiles.push({
          id: fileId,
          name: meta.title || fileId,
          mimeType: 'image/jpeg',
          category: meta.category,
        });
      }
    }

    // 3. Merge Drive Files with Sheets Metadata & Filter Hidden
    const items: ExploreShareItem[] = [];

    for (const df of driveFiles) {
      const meta = sheetMetaMap.get(df.id);

      // If hidden in spreadsheet, exclude from public gallery
      if (meta?.hidden) {
        continue;
      }

      const title =
        meta?.title ||
        df.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '); // Clean filename fallback
      const category = meta?.category || df.category || 'Emerging Technologies';
      const author = meta?.author || '';
      const description = meta?.description || '';
      const sourceUrl = meta?.sourceUrl || '';
      const displayOrder = meta?.displayOrder ?? 999;
      const featured = meta?.featured ?? false;

      items.push({
        id: df.id,
        driveFileId: df.id,
        title,
        category,
        author,
        description,
        sourceUrl,
        displayOrder,
        featured,
        image: `/api/explore-share/image/${df.id}`,
        date: df.createdTime
          ? new Date(df.createdTime).toLocaleDateString('en-US', {
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            })
          : 'Recent',
      });
    }

    // 4. Sort: Featured first, then Display Order ascending, then ID
    items.sort((a, b) => {
      if (a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }
      if (a.displayOrder !== b.displayOrder) {
        return a.displayOrder - b.displayOrder;
      }
      return a.title.localeCompare(b.title);
    });

    // Update in-memory cache
    cachedGallery = {
      data: items,
      timestamp: Date.now(),
    };

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
      cached: false,
    });
  } catch (error: any) {
    console.error('[API /api/explore-share] Error:', error);

    // Fallback to stale cache if available
    if (cachedGallery) {
      return res.status(200).json({
        success: true,
        count: cachedGallery.data.length,
        data: cachedGallery.data,
        stale: true,
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve Explore & Share gallery. Please try again.',
    });
  }
}
