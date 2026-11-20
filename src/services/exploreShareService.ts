import { TECH_UPDATES_DATA } from '../data/technologyUpdates';

export interface ExploreSharePoster {
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

// Convert fallback data to match ExploreSharePoster interface
const FALLBACK_POSTERS: ExploreSharePoster[] = TECH_UPDATES_DATA.map((item, index) => ({
  id: item.id,
  driveFileId: item.id,
  title: item.title,
  category: item.category,
  author: 'Binary Battle Club',
  description: item.description,
  sourceUrl: item.sourceUrl || '',
  displayOrder: index + 1,
  featured: index === 0,
  image: item.image,
  date: item.date,
}));

/**
 * Fetches published posters from the Google Drive + Sheets content system via /api/explore-share
 */
export async function fetchExploreSharePosters(): Promise<ExploreSharePoster[]> {
  try {
    const res = await fetch('/api/explore-share', {
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      console.warn(`[ExploreShareService] Server returned status ${res.status}, using cached data.`);
      return FALLBACK_POSTERS;
    }

    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return json.data;
    }

    return FALLBACK_POSTERS;
  } catch (err) {
    console.warn('[ExploreShareService] Network error fetching posters:', err);
    return FALLBACK_POSTERS;
  }
}
