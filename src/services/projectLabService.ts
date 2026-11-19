import { ProjectLabItem, StudentProfile } from '../data/projectLabData';
import fallbackProjectData from '../data/project-data.json';

export const SHEETDB_API_ENDPOINT = 'https://sheetdb.io/api/v1/ja94zu4m36qlw';
export const CACHE_STORAGE_KEY = 'bbc_project_lab_data_v4';
export const CACHE_TIMESTAMP_KEY = 'bbc_project_lab_timestamp_v4';
export const SYNC_INTERVAL_MS = 60000; // 60 seconds

/**
 * Direct mapping of Google Drive File IDs to authentic high-resolution presentation artwork.
 * Verified against presentation slides and the official submission catalog.
 */
export const DRIVE_ID_TO_ASSET_MAP: Record<string, string> = {
  // 1. BinBrain AI – Smart Waste Management (Ashu Patel)
  '1WtGt9v9mutStceZAza2n4qm-rQrCorUA': '/images/project_lab/matched/binbrain_ai.png',
  // 2. DIMPY'S COSMOS (Dimpy Rai - Row 2 & Row 6)
  '1Fxcf_YsbSGpHEH-xsQ8r3jxxhes2nhhb': '/images/project_lab/matched/dimpy_cosmos.png',
  '1VdKm1J5Pakxb5JJvKey_kCWTHUYR91l5': '/images/project_lab/matched/dimpy_cosmos.png',
  // 3. Music Royalty Vault (Ashu Patel)
  '1pdpeV3g_x_8JC3aJG2m8fAIA1qiSAdGd': '/images/project_lab/matched/music_royalty_vault.png',
  // 4. AISECT EXCELLENCE DASHBOARD (Irfan Ansari)
  '13RXccOIKr3GO_UxxsxNB13k17Ha6nLCP': '/images/project_lab/unmatched_from_ppt/image5.png',
  // 5. Social Pulse – Real-Time Sentiment Analysis (Irfan Ansari)
  '1uJWcGGJQLla2QA_qiuKFq0niCANCHgu7': '/images/project_lab/unmatched_from_ppt/image16.png',
  // 6. Cyber safe portal (Sakshi Ahirwar)
  '1vUuF4MUTMjhoNFQ3fRF7-qZcssGvESau': '/images/project_lab/matched/cybersafe_portal.jpg',
  // 7. Smart notice board (Sakshi Ahirwar)
  '1eAbwdDSwilvtTBVwbIuW1KR97riqcqMD': '/images/project_lab/matched/smart_notice_board.png',
  // 8. SpendWise – Personal Expense & Budget Tracker (Raushan Kumar & Soumya Yadav - Row 9 & Row 10)
  '1LxQsQ-FGwpx5gxFA9iJqEJtQEu5YLke5': '/images/project_lab/matched/spendwise.png',
  '1ckAMA9LP4uzxufHJVXZNB63oIz_n1tPu': '/images/project_lab/matched/spendwise.png',
  // 9. AI Examiner (Irfan Ansari)
  '1Ue2ZtSQWGoptgX4xTtC2I6zkyYMFA2x7': '/images/project_lab/unmatched_from_ppt/image10.png',
  // 10. Cyber Qwest (Sakshi Ahirwar)
  '1wp4EzfL2_mgdCYzBKIqQfTKwT99Szo4G': '/images/project_lab/unmatched_from_ppt/image9.jpg',
  // 11. Resumate AI (Soumya Yadav)
  '13oQDZFY-BYA6gStYIN9zxHUMs2nU1AIY': '/images/project_lab/unmatched_from_ppt/image8.png',
  // 12. App for makeup brand / Glow Botany (Gouri Pandey)
  '14Tqm7ODhg9NeWLq5Owe__VYPz8yNoPZg': '/images/project_lab/unmatched_from_ppt/image15.png',
  // 13. Particles.AI (Syed Faizan Ali)
  '1wDGTWMWsgWeapuMtnCy9FBpU_NuCJIey': '/images/project_lab/matched/particles_ai.png',
  // 14. PixelMe.Faizan (Syed Faizan Ali)
  '1x0WCmAOBf-feWLP93GRTOwhTLDcP6cIT': '/images/project_lab/matched/pixelme.png',
  // 15. 3D Portfolio (Dimpy Rai)
  '1qNYy7jCro-v8ppC8Qs4dKjpsLwncvhr8': '/images/project_lab/unmatched_from_ppt/image12.png',
  // 16. Ai diwali photo booth (Dimpy Rai)
  '1yE_QFRMyn0gzx0g3KsfqxbzornJDTHJ0': '/images/project_lab/unmatched_from_ppt/image25.png',
  // 17. VocaGuide (Devesh Kumar Sen)
  '1Ch6LMeOc_9mjfagfqlitFVVfFh9uCXD6': '/images/project_lab/unmatched_from_ppt/image23.jpeg',
  // 18. Drishti AI – Eyes for the Blind (Juhi Pawar)
  '1KG1MxetsUgA-KZQ8PVqo9TylXlEURWIg': '/images/project_lab/matched/drishti_ai.jpeg',
  // 19. Air Canvas Pro: Horizon (Syed Faizan Ali)
  '1wWJTryVRsslKIBlNA0J2Gs5NMWkZs_Wv': '/images/project_lab/unmatched_from_ppt/image13.png',
  // 20. AEGIS (Hemant Singroly & Soumya Malviya)
  '1CebkayPrv7CqTwBP4qUXYN4dS_7-D-Xf': '/images/project_lab/unmatched_from_ppt/image19.jpg',
  // 21. SHANU (AI CHATBOT) (Ayushi Tripathi)
  '1bHRHFF2KU9GMgvw5N-J4kojibJWY8Dap': '/images/project_lab/unmatched_from_ppt/image24.png',
};

// Known matched local assets for verified projects
const LOCAL_ASSET_MAP: Record<string, string> = {
  'spendwise': '/images/project_lab/matched/spendwise.png',
  'pmi-ai': '/images/project_lab/matched/pmi_ai.png',
  'pmi.ai': '/images/project_lab/matched/pmi_ai.png',
  'cybersafe-portal': '/images/project_lab/matched/cybersafe_portal.jpg',
  'cybersafe': '/images/project_lab/matched/cybersafe_portal.jpg',
  'binbrain-ai': '/images/project_lab/matched/binbrain_ai.png',
  'binbrain': '/images/project_lab/matched/binbrain_ai.png',
  'dimpys-cosmos': '/images/project_lab/matched/dimpy_cosmos.png',
  'dimpy-cosmos': '/images/project_lab/matched/dimpy_cosmos.png',
  'cosmos': '/images/project_lab/matched/dimpy_cosmos.png',
  'drishti-ai': '/images/project_lab/matched/drishti_ai.jpeg',
  'drishti': '/images/project_lab/matched/drishti_ai.jpeg',
  'music-royalty-vault': '/images/project_lab/matched/music_royalty_vault.png',
  'particles-ai': '/images/project_lab/matched/particles_ai.png',
  'pixelme': '/images/project_lab/matched/pixelme.png',
  'smart-notice-board': '/images/project_lab/matched/smart_notice_board.png',
  'student-management-system': '/images/project_lab/matched/student_management.png',
};

const URL_ASSET_MAP: Record<string, string> = {
  'https://spend-wise-neon.vercel.app': '/images/project_lab/matched/spendwise.png',
  'https://magenta-flan-77eae8.netlify.app': '/images/project_lab/matched/spendwise.png',
  'https://pmi-ai.vercel.app': '/images/project_lab/matched/pmi_ai.png',
  'https://cybersafe-portal.netlify.app': '/images/project_lab/matched/cybersafe_portal.jpg',
  'https://binbrain.netlify.app': '/images/project_lab/matched/binbrain_ai.png',
  'https://dimpys-cosmos.netlify.app': '/images/project_lab/matched/dimpy_cosmos.png',
  'https://dimpycosmos.lovable.app': '/images/project_lab/matched/dimpy_cosmos.png',
  'https://drishti-ai.vercel.app': '/images/project_lab/matched/drishti_ai.jpeg',
  'https://drishti-delta-five.vercel.app': '/images/project_lab/matched/drishti_ai.jpeg',
  'https://royaltyvault.netlify.app': '/images/project_lab/matched/music_royalty_vault.png',
  'https://particles-ai.netlify.app': '/images/project_lab/matched/particles_ai.png',
  'https://particles-ai.vercel.app': '/images/project_lab/matched/particles_ai.png',
  'https://pixelme-ai.netlify.app': '/images/project_lab/matched/pixelme.png',
  'https://pixelmefaizan.vercel.app': '/images/project_lab/matched/pixelme.png',
  'https://smart-notice-board.netlify.app': '/images/project_lab/matched/smart_notice_board.png',
  'https://sgsusmartcollegenoticeboard-3671.ai.studio': '/images/project_lab/matched/smart_notice_board.png',
  'https://aisect-skills-excellence-dashboard.vercel.app': '/images/project_lab/unmatched_from_ppt/image5.png',
  'https://3d-portfolio-rose-zeta.vercel.app': '/images/project_lab/unmatched_from_ppt/image12.png',
  'https://festive-selfie-studio-dimpy.lovable.app': '/images/project_lab/unmatched_from_ppt/image25.png',
  'https://vocaguide.vercel.app': '/images/project_lab/unmatched_from_ppt/image23.jpeg',
  'https://air-canvas-cyan.vercel.app': '/images/project_lab/unmatched_from_ppt/image13.png',
  'https://aegis-3d.beacon.host': '/images/project_lab/unmatched_from_ppt/image19.jpg',
  'https://shanu-speech-companion.lovable.app': '/images/project_lab/unmatched_from_ppt/image24.png',
};

// Secondary regex keywords for robust fallback matching
export const KEYWORD_ASSET_MAP: Array<{ match: RegExp; asset: string }> = [
  { match: /binbrain/i, asset: '/images/project_lab/matched/binbrain_ai.png' },
  { match: /cosmos/i, asset: '/images/project_lab/matched/dimpy_cosmos.png' },
  { match: /royalty.*vault/i, asset: '/images/project_lab/matched/music_royalty_vault.png' },
  { match: /aisect.*excellence/i, asset: '/images/project_lab/unmatched_from_ppt/image5.png' },
  { match: /social.*pulse/i, asset: '/images/project_lab/unmatched_from_ppt/image16.png' },
  { match: /cybersafe|cyber.*safe/i, asset: '/images/project_lab/matched/cybersafe_portal.jpg' },
  { match: /smart.*notice.*board/i, asset: '/images/project_lab/matched/smart_notice_board.png' },
  { match: /spendwise/i, asset: '/images/project_lab/matched/spendwise.png' },
  { match: /examiner|evaluator/i, asset: '/images/project_lab/unmatched_from_ppt/image10.png' },
  { match: /cyber.*qwest|cyberquest/i, asset: '/images/project_lab/unmatched_from_ppt/image9.jpg' },
  { match: /resumate/i, asset: '/images/project_lab/unmatched_from_ppt/image8.png' },
  { match: /makeup|glow.*botany/i, asset: '/images/project_lab/unmatched_from_ppt/image15.png' },
  { match: /particles/i, asset: '/images/project_lab/matched/particles_ai.png' },
  { match: /pixelme/i, asset: '/images/project_lab/matched/pixelme.png' },
  { match: /3d.*portfolio/i, asset: '/images/project_lab/unmatched_from_ppt/image12.png' },
  { match: /diwali.*photo/i, asset: '/images/project_lab/unmatched_from_ppt/image25.png' },
  { match: /vocaguide/i, asset: '/images/project_lab/unmatched_from_ppt/image23.jpeg' },
  { match: /drishti/i, asset: '/images/project_lab/matched/drishti_ai.jpeg' },
  { match: /air.*canvas/i, asset: '/images/project_lab/unmatched_from_ppt/image13.png' },
  { match: /aegis/i, asset: '/images/project_lab/unmatched_from_ppt/image19.jpg' },
  { match: /shanu/i, asset: '/images/project_lab/unmatched_from_ppt/image24.png' },
  { match: /pmi/i, asset: '/images/project_lab/matched/pmi_ai.png' },
  { match: /student.*management/i, asset: '/images/project_lab/matched/student_management.png' },
];

/**
 * Normalizes text to a clean URL slug
 */
export function makeSlug(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Capitalizes names cleanly (e.g. "raushan kumar" -> "Raushan Kumar")
 */
export function toTitleCase(name: string): string {
  if (!name) return '';
  return name
    .trim()
    .split(/\s+/)
    .map((word) => {
      if (/^(ai|3d|ui|ux|api|id)$/i.test(word)) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Extracts student contributors from a cell
 * Supports: "and", "&", "+", and commas
 */
export function parseContributors(cellValue: string): string[] {
  if (!cellValue) return [];
  const rawParts = cellValue.split(/\s+(?:and|&|\+)\s+|,/i);
  const contributors: string[] = [];
  for (const part of rawParts) {
    const trimmed = part.trim();
    if (trimmed) {
      contributors.push(toTitleCase(trimmed));
    }
  }
  return contributors;
}

/**
 * Extracts all URLs from link cell, supporting Markdown syntax [text](url),
 * whitespace-separated URLs, and sandbox/file paths.
 */
export function extractUrls(text: string): string[] {
  if (!text) return [];
  const trimmed = text.trim();

  // 1. Markdown links: [label](url)
  const mdRegex = /\[([^\]]*)\]\((https?:\/\/[^\)]+)\)/g;
  const mdMatches: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = mdRegex.exec(trimmed)) !== null) {
    if (m[2]) mdMatches.push(m[2].trim());
  }
  if (mdMatches.length > 0) {
    return mdMatches;
  }

  // 2. Standard http/https links
  const httpRegex = /https?:\/\/[^\s\)]+/g;
  const httpMatches = trimmed.match(httpRegex);
  if (httpMatches && httpMatches.length > 0) {
    return httpMatches.map((u) => u.replace(/[\s,\)\]]+$/, '').trim());
  }

  // 3. Sandbox / local paths
  if (trimmed.includes('sandbox:') || trimmed.startsWith('/') || trimmed.startsWith('file:')) {
    const sandboxMatch = trimmed.match(/sandbox:[^\s]+/);
    if (sandboxMatch) {
      return [sandboxMatch[0].trim()];
    }
    return [trimmed];
  }

  return [trimmed];
}

/**
 * Normalizes URL to canonical form for deduplication
 * - strips trailing slash
 * - strips tracking query params
 * - lowercases scheme and domain
 */
export function normalizeCanonicalUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    const trackingParams = new Set([
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'fbclid',
      'si',
    ]);

    const cleanParams = new URLSearchParams();
    parsed.searchParams.forEach((val, key) => {
      if (!trackingParams.has(key.toLowerCase())) {
        cleanParams.append(key, val);
      }
    });

    let pathname = parsed.pathname;
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }

    if (parsed.hostname.toLowerCase().includes('github.com') && pathname.endsWith('.git')) {
      pathname = pathname.slice(0, -4);
    }

    const searchStr = cleanParams.toString();
    const query = searchStr ? `?${searchStr}` : '';
    return `${parsed.protocol}//${parsed.hostname.toLowerCase()}${parsed.port ? `:${parsed.port}` : ''}${pathname}${query}`;
  } catch {
    return trimmed.replace(/\/+$/, '');
  }
}

/**
 * Reliable Google Drive URL normalizer.
 * Extracts the file ID and converts supported image links into browser-displayable thumbnail URLs:
 * https://drive.google.com/thumbnail?id=FILE_ID&sz=w1600
 * Preserves ordinary HTTPS image URLs without modifying them.
 */
export function normalizeThumbnailUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();

  // If ordinary HTTPS image URL that is not Google Drive, preserve directly
  if (!trimmed.includes('drive.google.com') && !trimmed.includes('docs.google.com')) {
    return trimmed;
  }

  // Extract File ID from various Google Drive sharing formats:
  // e.g. https://drive.google.com/open?id=FILE_ID
  // e.g. https://drive.google.com/file/d/FILE_ID/view
  // e.g. https://drive.google.com/uc?id=FILE_ID
  let fileId = '';
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) {
    fileId = idMatch[1];
  } else {
    const dMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (dMatch && dMatch[1]) {
      fileId = dMatch[1];
    }
  }

  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1600`;
  }

  return trimmed;
}

/**
 * Extracts Google Drive file ID from a URL
 */
export function extractDriveFileId(url: string): string {
  if (!url) return '';
  const matchId = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchId && matchId[1]) return matchId[1];
  const matchPath = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchPath && matchPath[1]) return matchPath[1];
  return '';
}

/**
 * Resolves the authentic project thumbnail:
 * 1. Checks direct Google Drive File ID match against verified presentation artwork.
 * 2. Checks canonical working URL against verified deployed applications.
 * 3. Checks project title / slug keywords against known artwork assets.
 * 4. Returns local high-res asset as primary whenever available.
 * 5. If no local asset exists, returns the normalized Google Drive URL as primary.
 */
export function resolveProjectThumbnail(
  rawThumbnailUrl: string,
  projectName: string,
  primaryUrl: string,
  canonicalUrl: string
): { primary: string; rawDriveUrl: string; hasLocalAsset: boolean } {
  const driveId = extractDriveFileId(rawThumbnailUrl);
  const normalizedDrive = normalizeThumbnailUrl(rawThumbnailUrl);

  // 1. Direct Drive File ID match
  if (driveId && DRIVE_ID_TO_ASSET_MAP[driveId]) {
    return {
      primary: DRIVE_ID_TO_ASSET_MAP[driveId],
      rawDriveUrl: normalizedDrive,
      hasLocalAsset: true,
    };
  }

  // 2. Canonical URL match
  if (canonicalUrl && URL_ASSET_MAP[canonicalUrl]) {
    return {
      primary: URL_ASSET_MAP[canonicalUrl],
      rawDriveUrl: normalizedDrive,
      hasLocalAsset: true,
    };
  }

  // 3. Keyword / title / slug match
  const testString = `${projectName} ${primaryUrl}`.toLowerCase();
  for (const item of KEYWORD_ASSET_MAP) {
    if (item.match.test(testString)) {
      return {
        primary: item.asset,
        rawDriveUrl: normalizedDrive,
        hasLocalAsset: true,
      };
    }
  }

  // 4. Fallback to Google Drive URL (or raw image URL if non-Drive)
  return {
    primary: normalizedDrive || rawThumbnailUrl || '',
    rawDriveUrl: normalizedDrive,
    hasLocalAsset: false,
  };
}

/**
 * Infers category based on project title, description, or URL
 */
export function inferProjectCategory(title: string, desc: string, url: string): string {
  const combined = `${title} ${desc} ${url}`.toLowerCase();

  if (
    combined.includes('ai') ||
    combined.includes('gpt') ||
    combined.includes('machine learning') ||
    combined.includes('intelligence') ||
    combined.includes('detection') ||
    combined.includes('vision') ||
    combined.includes('photo booth') ||
    combined.includes('pmi') ||
    combined.includes('particles') ||
    combined.includes('binbrain') ||
    combined.includes('drishti')
  ) {
    return 'AI Projects';
  }

  if (
    combined.includes('cyber') ||
    combined.includes('security') ||
    combined.includes('safe') ||
    combined.includes('vault') ||
    combined.includes('aegis') ||
    combined.includes('threat') ||
    combined.includes('crypt')
  ) {
    return 'Cybersecurity';
  }

  return 'Web Development';
}

/**
 * Derives a professional tagline for a project
 */
export function deriveProjectTagline(title: string, category: string, desc: string): string {
  if (desc && desc.length > 10 && desc.length <= 70) {
    return desc.trim();
  }
  switch (category) {
    case 'AI Projects':
      return 'Intelligent Systems & Neural Computing';
    case 'Cybersecurity':
      return 'Digital Security & Defense Infrastructure';
    case 'Web Development':
    default:
      return 'Modern Full-Stack Web Application';
  }
}

/**
 * Raw Row Interface matching SheetDB output
 */
export interface RawSheetRow {
  Timestamp?: string;
  'Student Name'?: string;
  'Student Name '?: string;
  'Project Name'?: string;
  'Project Name '?: string;
  'Project Description (50 Words Max)'?: string;
  'Project Description (50 Words Max) '?: string;
  'Project Working Link'?: string;
  'Project Working Link '?: string;
  'Upload Thumbnail'?: string;
  'Upload Thumbnail '?: string;
  [key: string]: string | undefined;
}

/**
 * Normalizes a raw row object by trimming keys and values
 */
export function normalizeRow(raw: RawSheetRow): {
  timestamp: string;
  studentName: string;
  projectName: string;
  description: string;
  workingLink: string;
  thumbnail: string;
} {
  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    const cleanedKey = k.trim().replace(/\s+/g, ' ').toLowerCase();
    clean[cleanedKey] = (v || '').trim();
  }

  return {
    timestamp: clean['timestamp'] || '',
    studentName: clean['student name'] || '',
    projectName: clean['project name'] || '',
    description: clean['project description (50 words max)'] || '',
    workingLink: clean['project working link'] || '',
    thumbnail: clean['upload thumbnail'] || '',
  };
}

/**
 * Deduplicates and transforms raw spreadsheet rows into verified ProjectLabItems
 * according to the strict canonical URL deduplication rules.
 */
export function processSpreadsheetRecords(rawRows: RawSheetRow[]): {
  projects: ProjectLabItem[];
  students: StudentProfile[];
} {
  const projectsByCanonicalUrl: Map<string, ProjectLabItem> = new Map();
  const slugCounts: Record<string, number> = {};

  rawRows.forEach((rawRow, rowIndex) => {
    const row = normalizeRow(rawRow);
    if (!row.projectName && !row.workingLink) return;

    // 1. Parse and extract links
    const extractedUrls = extractUrls(row.workingLink);
    const primaryUrl = extractedUrls[0] || '';
    const secondaryUrl = extractedUrls.length > 1 ? extractedUrls[1] : undefined;
    const canonical = normalizeCanonicalUrl(primaryUrl);

    // Dedup key: prefer canonical URL; if no URL, use deterministic slugged title
    const dedupeKey = canonical || `title:${makeSlug(row.projectName)}`;

    // 2. Parse contributors
    const contributors = parseContributors(row.studentName);

    // 3. Resolve project thumbnail
    const resolvedThumb = resolveProjectThumbnail(
      row.thumbnail,
      row.projectName,
      primaryUrl,
      canonical
    );

    // 4. Check for existing project to merge
    if (projectsByCanonicalUrl.has(dedupeKey)) {
      const existing = projectsByCanonicalUrl.get(dedupeKey)!;

      // Rule 1 & 7: Merge contributors without duplicates
      contributors.forEach((contributor) => {
        if (!existing.contributors.includes(contributor)) {
          existing.contributors.push(contributor);
        }
        const cId = makeSlug(contributor);
        if (!existing.contributorIds.includes(cId)) {
          existing.contributorIds.push(cId);
        }
      });

      if (existing.contributors.length > 1) {
        existing.isCollaborative = true;
      }

      // Merge secondary URLs if available
      if (secondaryUrl && (!existing.allUrls || !existing.allUrls.includes(secondaryUrl))) {
        existing.allUrls = existing.allUrls || [existing.workingUrl];
        existing.allUrls.push(secondaryUrl);
        if (!existing.secondaryUrl) {
          existing.secondaryUrl = secondaryUrl;
          existing.secondaryUrlLabel = secondaryUrl.includes('app') ? 'Mobile App' : 'Alternate Link';
        }
      }

      // Keep the more descriptive text
      if (row.description && row.description.length > existing.description.length) {
        existing.description = row.description;
      }

      // Update thumbnail if new row has verified local asset or if currently missing
      if (resolvedThumb.hasLocalAsset && (!existing.thumbnailAsset || !existing.thumbnailAsset.startsWith('/images/'))) {
        existing.thumbnailAsset = resolvedThumb.primary;
        existing.thumbnailUrl = resolvedThumb.primary;
        existing.originalThumbnail = row.thumbnail;
      } else if (!existing.thumbnailUrl && resolvedThumb.primary) {
        existing.thumbnailUrl = resolvedThumb.primary;
        existing.thumbnailAsset = resolvedThumb.primary;
        existing.originalThumbnail = row.thumbnail;
      }

      // Keep alternate title if different
      if (row.projectName && row.projectName.toLowerCase() !== existing.title.toLowerCase()) {
        existing.alternateTitles = existing.alternateTitles || [];
        if (!existing.alternateTitles.includes(row.projectName)) {
          existing.alternateTitles.push(row.projectName);
        }
      }

      existing.submissionCount = (existing.submissionCount || 1) + 1;
    } else {
      // Create new project
      let baseSlug = makeSlug(row.projectName || `project-${rowIndex + 1}`);
      if (!baseSlug) baseSlug = `project-${rowIndex + 1}`;

      // Ensure unique ID
      if (slugCounts[baseSlug] !== undefined) {
        slugCounts[baseSlug] += 1;
        baseSlug = `${baseSlug}-${slugCounts[baseSlug]}`;
      } else {
        slugCounts[baseSlug] = 1;
      }

      const category = inferProjectCategory(row.projectName, row.description, primaryUrl);
      const isWebUrl = primaryUrl.startsWith('http://') || primaryUrl.startsWith('https://');
      const isGithub = primaryUrl.toLowerCase().includes('github.com');

      const finalThumb = resolvedThumb.primary;

      const tagline = deriveProjectTagline(row.projectName, category, row.description);
      const contributorIds = contributors.map((c) => makeSlug(c));
      const isCollaborative = contributors.length > 1;

      let secondaryLabel: string | undefined = undefined;
      if (secondaryUrl) {
        if (secondaryUrl.includes('app.html')) {
          secondaryLabel = 'Mobile App (Android APK)';
        } else {
          secondaryLabel = 'Live Application';
        }
      }

      const newProject: ProjectLabItem = {
        id: baseSlug,
        title: row.projectName || 'Untitled Innovation',
        tagline,
        description:
          row.description ||
          'Innovative prototype and real-world software solution engineered by Binary Battle Club student developers.',
        category,
        contributors,
        contributorIds,
        isCollaborative,
        workingUrl: isGithub ? '' : primaryUrl,
        githubUrl: isGithub ? primaryUrl : '',
        allUrls: extractedUrls,
        secondaryUrl,
        secondaryUrlLabel: secondaryLabel,
        thumbnailUrl: finalThumb,
        thumbnailAsset: finalThumb, // alias for full compatibility
        originalThumbnail: row.thumbnail,
        featured: true, // All 27 unique projects are included in the slideshow
        isValidWebUrl: isWebUrl,
        submissionCount: 1,
        timestamp: row.timestamp,
      };

      projectsByCanonicalUrl.set(dedupeKey, newProject);
    }
  });

  const projects = Array.from(projectsByCanonicalUrl.values());

  // Development diagnostics logging
  if (typeof window !== 'undefined' && (window as any).__DEV_BBC__) {
    console.groupCollapsed(`[ProjectLab Diagnostics] ${projects.length} Unique Projects Loaded`);
    projects.forEach((p, idx) => {
      console.debug(`${idx + 1}. [${p.id}] ${p.title}`, {
        contributors: p.contributors,
        originalThumbnail: p.originalThumbnail,
        thumbnailUrl: p.thumbnailUrl,
        isValidWebUrl: p.isValidWebUrl,
        workingUrl: p.workingUrl,
      });
    });
    console.groupEnd();
  }

  // Generate dynamic student profiles from contributors
  const studentMap: Map<string, StudentProfile> = new Map();

  projects.forEach((proj) => {
    proj.contributors.forEach((contributorName, idx) => {
      const slug = proj.contributorIds[idx] || makeSlug(contributorName);
      if (!studentMap.has(slug)) {
        const parts = contributorName.split(' ');
        const initials =
          parts.length >= 2
            ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
            : contributorName.slice(0, 2).toUpperCase();

        studentMap.set(slug, {
          id: slug,
          name: contributorName,
          email: '', // Never expose private email
          avatarInitials: initials,
          projectIds: [proj.id],
          tagline: 'Student Developer & Innovator',
        });
      } else {
        const existingStudent = studentMap.get(slug)!;
        if (!existingStudent.projectIds.includes(proj.id)) {
          existingStudent.projectIds.push(proj.id);
        }
      }
    });
  });

  // Enhance student taglines based on project categories and counts
  studentMap.forEach((student) => {
    const studentProjs = projects.filter((p) => student.projectIds.includes(p.id));
    const categories = new Set(studentProjs.map((p) => p.category));

    if (categories.has('Cybersecurity') && categories.size === 1) {
      student.tagline = 'Cybersecurity Specialist & Digital Defense Builder';
    } else if (categories.has('AI Projects') && categories.size === 1) {
      student.tagline = 'AI & Machine Learning Developer';
    } else if (categories.has('AI Projects') && categories.has('Web Development')) {
      student.tagline = 'Full-Stack Developer & Intelligent Systems Architect';
    } else if (studentProjs.length > 2) {
      student.tagline = 'Multi-Disciplinary Software Engineer & Prolific Creator';
    } else {
      student.tagline = 'Frontend Engineer & Creative Web Technologist';
    }
  });

  const students = Array.from(studentMap.values()).sort((a, b) => {
    const nameA = a.name.trim().replace(/\s+/g, ' ');
    const nameB = b.name.trim().replace(/\s+/g, ' ');
    return (
      nameA.localeCompare(nameB, undefined, { sensitivity: 'base', numeric: true }) ||
      nameA.localeCompare(nameB)
    );
  });

  return { projects, students };
}

/**
 * Loads cached data from localStorage
 */
export function getCachedProjectLabData(): {
  projects: ProjectLabItem[];
  students: StudentProfile[];
  timestamp: number | null;
} | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }
  try {
    const rawData = localStorage.getItem(CACHE_STORAGE_KEY);
    const rawTime = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (rawData) {
      const parsed = JSON.parse(rawData);
      return {
        projects: (parsed.projects || []).map((p: any) => {
          const resolved = resolveProjectThumbnail(
            p.originalThumbnail || p.thumbnailUrl || p.thumbnailAsset || '',
            p.title || '',
            p.workingUrl || p.githubUrl || '',
            normalizeCanonicalUrl(p.workingUrl || '')
          );
          const finalThumb = resolved.hasLocalAsset
            ? resolved.primary
            : p.thumbnailUrl || p.thumbnailAsset || resolved.primary;

          return {
            ...p,
            thumbnailUrl: finalThumb,
            thumbnailAsset: finalThumb,
            featured: true,
          };
        }),
        students: parsed.students || [],
        timestamp: rawTime ? parseInt(rawTime, 10) : null,
      };
    }
  } catch (err) {
    console.warn('[ProjectLabService] Failed to read from cache:', err);
  }
  return null;
}

/**
 * Saves project data to localStorage
 */
export function saveProjectLabDataToCache(
  projects: ProjectLabItem[],
  students: StudentProfile[]
): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    localStorage.setItem(
      CACHE_STORAGE_KEY,
      JSON.stringify({ projects, students })
    );
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (err) {
    console.warn('[ProjectLabService] Failed to write to cache:', err);
  }
}

/**
 * Fetches live data from SheetDB API with timeout and error resilience
 */
export async function fetchLiveSpreadsheetData(): Promise<{
  projects: ProjectLabItem[];
  students: StudentProfile[];
}> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch(SHEETDB_API_ENDPOINT, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`SheetDB responded with status ${response.status}`);
    }

    const rawRows = (await response.json()) as RawSheetRow[];
    if (!Array.isArray(rawRows) || rawRows.length === 0) {
      throw new Error('Received empty or invalid data format from SheetDB');
    }

    const processed = processSpreadsheetRecords(rawRows);

    // Save to cache on successful fetch
    saveProjectLabDataToCache(processed.projects, processed.students);

    return processed;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Retrieves fallback data from bundled project-data.json
 */
export function getBundledFallbackData(): {
  projects: ProjectLabItem[];
  students: StudentProfile[];
} {
  return {
    projects: (fallbackProjectData.projects as any[]).map((p) => ({
      ...p,
      thumbnailUrl: p.thumbnailUrl || p.thumbnailAsset || '',
      thumbnailAsset: p.thumbnailUrl || p.thumbnailAsset || '',
      featured: true,
    })),
    students: fallbackProjectData.students as unknown as StudentProfile[],
  };
}
