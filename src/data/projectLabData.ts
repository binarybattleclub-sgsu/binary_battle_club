import { useState, useEffect, useCallback, useRef } from 'react';
import projectDataJson from './project-data.json';
import {
  fetchLiveSpreadsheetData,
  getCachedProjectLabData,
  SYNC_INTERVAL_MS,
  getBundledFallbackData,
} from '../services/projectLabService';

export interface ProjectLabItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string;
  contributors: string[];
  contributorIds: string[];
  isCollaborative: boolean;
  workingUrl: string;
  githubUrl: string;
  thumbnailAsset: string;
  featured: boolean;
  attributionNotes?: string;
  // Extended dynamic fields
  allUrls?: string[];
  secondaryUrl?: string;
  secondaryUrlLabel?: string;
  isValidWebUrl?: boolean;
  submissionCount?: number;
  alternateTitles?: string[];
  timestamp?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  projectIds: string[];
  tagline: string;
}

export const PROJECTS: ProjectLabItem[] = projectDataJson.projects as unknown as ProjectLabItem[];
export const STUDENTS: StudentProfile[] = projectDataJson.students as unknown as StudentProfile[];

/**
 * Returns all default static projects
 */
export function getAllProjects(): ProjectLabItem[] {
  return PROJECTS;
}

/**
 * Returns all default static student builders
 */
export function getAllStudents(): StudentProfile[] {
  return STUDENTS;
}

/**
 * Retrieves a single project by its unique slug ID
 */
export function getProjectById(id: string, projectList: ProjectLabItem[] = PROJECTS): ProjectLabItem | undefined {
  return projectList.find((p) => p.id.toLowerCase() === id.toLowerCase());
}

/**
 * Retrieves a single student profile by their slug ID
 */
export function getStudentById(id: string, studentList: StudentProfile[] = STUDENTS): StudentProfile | undefined {
  return studentList.find((s) => s.id.toLowerCase() === id.toLowerCase());
}

/**
 * Retrieves all projects associated with a given student ID
 */
export function getProjectsForStudent(
  studentId: string,
  projectList: ProjectLabItem[] = PROJECTS,
  studentList: StudentProfile[] = STUDENTS
): ProjectLabItem[] {
  const student = getStudentById(studentId, studentList);
  if (!student) return [];
  return projectList.filter(
    (p) => student.projectIds.includes(p.id) || p.contributorIds.includes(studentId)
  );
}

/**
 * Retrieves featured projects for the hero carousel/banner
 */
export function getFeaturedProjects(projectList: ProjectLabItem[] = PROJECTS): ProjectLabItem[] {
  const featured = projectList.filter((p) => p.featured);
  return featured.length > 0 ? featured : projectList.slice(0, 5);
}

/**
 * Dynamically computes statistics directly from verified data structures
 */
export function getProjectLabStats(
  projectList: ProjectLabItem[] = PROJECTS,
  studentList: StudentProfile[] = STUDENTS
) {
  const totalProjects = projectList.length;
  const totalStudents = studentList.length;
  const collaborativeCount = projectList.filter((p) => p.isCollaborative).length;
  return {
    totalProjects,
    totalStudents,
    collaborativeCount,
  };
}

/**
 * Hook to consume dynamic, live-synced project lab data with automatic 60s background polling,
 * instant localStorage cache hydration, and network failure resilience.
 */
export function useProjectLabData() {
  // Initialize with cached data if available, otherwise bundled snapshot
  const initialCache = getCachedProjectLabData();
  const [projects, setProjects] = useState<ProjectLabItem[]>(
    initialCache?.projects && initialCache.projects.length > 0
      ? initialCache.projects
      : PROJECTS
  );
  const [students, setStudents] = useState<StudentProfile[]>(
    initialCache?.students && initialCache.students.length > 0
      ? initialCache.students
      : STUDENTS
  );
  const [isLoading, setIsLoading] = useState<boolean>(!initialCache);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(
    initialCache?.timestamp ? new Date(initialCache.timestamp) : null
  );
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef<boolean>(true);

  const syncData = useCallback(async (isManual: boolean = false) => {
    if (isManual) {
      setIsRefreshing(true);
    }
    setError(null);

    try {
      const data = await fetchLiveSpreadsheetData();
      if (isMountedRef.current) {
        if (data.projects.length > 0) {
          setProjects(data.projects);
          setStudents(data.students);
          setLastUpdated(new Date());
        }
        setIsLoading(false);
        setIsRefreshing(false);
      }
    } catch (err: any) {
      console.warn('[useProjectLabData] Sync failed, maintaining resilient fallback:', err);
      if (isMountedRef.current) {
        setError(err.message || 'Unable to sync with live spreadsheet');
        setIsLoading(false);
        setIsRefreshing(false);

        // If we don't have projects yet, load bundled fallback
        setProjects((prev) => (prev.length > 0 ? prev : getBundledFallbackData().projects));
        setStudents((prev) => (prev.length > 0 ? prev : getBundledFallbackData().students));
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    // Fetch immediately on mount
    syncData(false);

    // Setup 60-second polling interval
    const intervalId = setInterval(() => {
      syncData(false);
    }, SYNC_INTERVAL_MS);

    return () => {
      isMountedRef.current = false;
      clearInterval(intervalId);
    };
  }, [syncData]);

  const refreshData = useCallback(() => {
    return syncData(true);
  }, [syncData]);

  return {
    projects,
    students,
    isLoading,
    isRefreshing,
    lastUpdated,
    error,
    refreshData,
  };
}
