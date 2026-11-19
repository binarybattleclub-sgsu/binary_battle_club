export interface StudentProject {
  id: string;
  title: string;
  studentName: string;
  studentRole: string;
  studentAvatar: string;
  thumbnail: string;
  category: 'AI Projects' | 'Web Development' | 'Mobile Applications' | 'Cybersecurity' | 'Others';
  description: string;
  technologies: string[];
  liveUrl: string;
  githubUrl?: string;
  featured?: boolean;
}

export const PROJECTS_DATA: StudentProject[] = [];
