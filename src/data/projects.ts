import { ASSETS } from './assets';

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

export const PROJECTS_DATA: StudentProject[] = [
  {
    id: 'proj-1',
    title: 'SmartCampus: AI-Driven University Portal & Resource Tracker',
    studentName: 'Student Innovator (Demonstration Profile)',
    studentRole: 'B.Tech CSE - 5th Sem',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    thumbnail: ASSETS.studentProjects.demo1,
    category: 'AI Projects',
    description: 'An intelligent academic management assistant utilizing local embeddings to answer student queries, monitor timetable conflicts, and optimize campus lab allocations.',
    technologies: ['React', 'Python', 'FastAPI', 'LangChain', 'Tailwind CSS'],
    liveUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    featured: true,
  },
  {
    id: 'proj-2',
    title: 'PulseFit: Flutter Health & Real-time Bio-Metrics Companion',
    studentName: 'Student Developer (Demonstration Profile)',
    studentRole: 'B.Tech IT - 7th Sem',
    studentAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    thumbnail: ASSETS.studentProjects.mobileMockup,
    category: 'Mobile Applications',
    description: 'Cross-platform mobile application providing real-time workout tracking, personalized nutrition suggestions, and automated posture correction using edge sensor data.',
    technologies: ['Flutter', 'Dart', 'Firebase', 'TensorFlow Lite'],
    liveUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    featured: true,
  },
  {
    id: 'proj-3',
    title: 'SentinelGuard: Automated Cyber Vulnerability Audit Suite',
    studentName: 'Student Researcher (Demonstration Profile)',
    studentRole: 'Cybersecurity Specialization - 6th Sem',
    studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    thumbnail: ASSETS.studentProjects.presentation1,
    category: 'Cybersecurity',
    description: 'A modular penetration testing helper script and dashboard that scans university intranet microservices for misconfigured headers, open ports, and credential leaks.',
    technologies: ['Go', 'Python', 'Docker', 'React', 'Tailwind'],
    liveUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    featured: true,
  },
  {
    id: 'proj-4',
    title: 'DevCollab: Real-Time Collaborative Markdown & Code Studio',
    studentName: 'Student Engineer (Demonstration Profile)',
    studentRole: 'B.Tech CSE - 5th Sem',
    studentAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    thumbnail: ASSETS.studentProjects.ui2,
    category: 'Web Development',
    description: 'Browser-based multiplayer markdown editor featuring real-time CRDT synchronization, integrated syntax highlighting, and instant team workspace sharing.',
    technologies: ['TypeScript', 'React', 'Node.js', 'Socket.io', 'Tailwind'],
    liveUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    featured: false,
  },
  {
    id: 'proj-5',
    title: 'EcoRoute: Multimodal Transit & Low-Carbon Journey Planner',
    studentName: 'Student Innovator (Demonstration Profile)',
    studentRole: 'B.Tech Data Science - 4th Sem',
    studentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    thumbnail: ASSETS.studentProjects.presentation2,
    category: 'AI Projects',
    description: 'Graph-based pathfinding engine evaluating public bus schedules, walking routes, and shared bicycles to minimize urban carbon footprints in Bhopal.',
    technologies: ['Python', 'Neo4j', 'FastAPI', 'Mapbox GL', 'React'],
    liveUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    featured: false,
  },
  {
    id: 'proj-6',
    title: 'InnoVault: Decentralized Academic Credential Verification',
    studentName: 'Student Developer (Demonstration Profile)',
    studentRole: 'B.Tech CSE - 6th Sem',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    thumbnail: ASSETS.studentProjects.ui3,
    category: 'Others',
    description: 'Tamper-proof academic diploma verification system using cryptographic digital signatures, reducing credential forgery and streamlining university admissions.',
    technologies: ['Solidity', 'Ethers.js', 'React', 'Next.js', 'Tailwind'],
    liveUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    featured: false,
  },
];
