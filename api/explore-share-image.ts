import crypto from 'crypto';

// Generate OAuth access token using Service Account JSON
async function getServiceAccountAccessToken(serviceAccountJson: string): Promise<string | null> {
  try {
    const creds = JSON.parse(serviceAccountJson);
    if (!creds.client_email || !creds.private_key) return null;

    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const claimSet = {
      iss: creds.client_email,
      scope: 'https://www.googleapis.com/auth/drive.readonly',
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

    if (!tokenRes.ok) return null;
    const tokenData = await tokenRes.json();
    return tokenData.access_token || null;
  } catch {
    return null;
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Extract fileId from query or URL
  const fileId =
    req.query?.fileId ||
    req.url?.split('fileId=')?.[1]?.split('&')?.[0] ||
    req.url?.split('/image/')?.[1]?.split('?')?.[0];

  if (!fileId || typeof fileId !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(fileId)) {
    return res.status(400).json({ error: 'Invalid or missing fileId parameter.' });
  }

  const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  try {
    let imageBuffer: Buffer | null = null;
    let contentType = 'image/jpeg';

    if (serviceAccountJson && serviceAccountJson.trim() !== '') {
      const accessToken = await getServiceAccountAccessToken(serviceAccountJson);
      if (accessToken) {
        // Authenticated Google Drive API v3 media stream
        const driveApiUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
        const driveRes = await fetch(driveApiUrl, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (driveRes.ok) {
          contentType = driveRes.headers.get('content-type') || 'image/jpeg';
          const arrayBuffer = await driveRes.arrayBuffer();
          imageBuffer = Buffer.from(arrayBuffer);
        }
      }
    }

    // Direct proxy fallback (Google Drive Content CDN)
    if (!imageBuffer) {
      const cdnUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
      const cdnRes = await fetch(cdnUrl);

      if (cdnRes.ok) {
        contentType = cdnRes.headers.get('content-type') || 'image/jpeg';
        const arrayBuffer = await cdnRes.arrayBuffer();
        imageBuffer = Buffer.from(arrayBuffer);
      } else {
        // Fallback to uc?export=view
        const ucUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
        const ucRes = await fetch(ucUrl);
        if (ucRes.ok) {
          contentType = ucRes.headers.get('content-type') || 'image/jpeg';
          const arrayBuffer = await ucRes.arrayBuffer();
          imageBuffer = Buffer.from(arrayBuffer);
        }
      }
    }

    if (!imageBuffer) {
      return res.status(404).json({ error: 'Image not found or inaccessible in Google Drive.' });
    }

    // Return the image with long-lived browser and CDN caching
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
    return res.status(200).send(imageBuffer);
  } catch (error: any) {
    console.error(`[API /api/explore-share-image] Error streaming image ${fileId}:`, error);
    return res.status(500).json({ error: 'Failed to retrieve image.' });
  }
}
