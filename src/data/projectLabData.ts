import projectDataJson from './project-data.json';

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
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatarInitials: string;
  projectIds: string[];
  tagline: string;
}

export const PROJECTS: ProjectLabItem[] = projectDataJson.projects;
export const STUDENTS: StudentProfile[] = projectDataJson.students;

/**
 * Returns all unique verified projects
 */
export function getAllProjects(): ProjectLabItem[] {
  return PROJECTS;
}

/**
 * Returns all verified student builders
 */
export function getAllStudents(): StudentProfile[] {
  return STUDENTS;
}

/**
 * Retrieves a single project by its unique slug ID
 */
export function getProjectById(id: string): ProjectLabItem | undefined {
  return PROJECTS.find((p) => p.id.toLowerCase() === id.toLowerCase());
}

/**
 * Retrieves a single student profile by their slug ID
 */
export function getStudentById(id: string): StudentProfile | undefined {
  return STUDENTS.find((s) => s.id.toLowerCase() === id.toLowerCase());
}

/**
 * Retrieves all projects associated with a given student ID
 * Resolves shared/collaborative projects like SpendWise seamlessly for both contributors
 */
export function getProjectsForStudent(studentId: string): ProjectLabItem[] {
  const student = getStudentById(studentId);
  if (!student) return [];
  return PROJECTS.filter((p) => student.projectIds.includes(p.id) || p.contributorIds.includes(studentId));
}

/**
 * Retrieves featured projects for the hero carousel
 */
export function getFeaturedProjects(): ProjectLabItem[] {
  return PROJECTS.filter((p) => p.featured);
}

/**
 * Dynamically computes statistics directly from verified data structures
 */
export function getProjectLabStats() {
  const totalProjects = PROJECTS.length;
  const totalStudents = STUDENTS.length;
  const collaborativeCount = PROJECTS.filter((p) => p.isCollaborative).length;
  return {
    totalProjects,
    totalStudents,
    collaborativeCount,
  };
}
