import { ASSETS } from './assets';

export interface TechUpdate {
  id: string;
  title: string;
  category: 'Artificial Intelligence' | 'Generative AI' | 'Machine Learning' | 'Emerging Technologies' | 'Technology News' | 'Useful AI Tools';
  description: string;
  date: string;
  readTime: string;
  image: string;
  sourceUrl?: string;
  tags: string[];
}

export interface FridaySession {
  id: string;
  title: string;
  topic: string;
  description: string;
  date: string;
  time: string;
  speaker: string;
  venue: string;
  image: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

export const TECH_UPDATES_DATA: TechUpdate[] = [
  {
    id: 'update-1',
    title: 'Advancements in Multimodal Generative AI & Reasoning Models',
    category: 'Generative AI',
    description: 'Exploring how next-generation multimodal architectures combine visual reasoning, audio processing, and chain-of-thought code synthesis for real-world automation.',
    date: 'Nov 04, 2026',
    readTime: '4 min read',
    image: ASSETS.technologyUpdates.aiUpdates,
    tags: ['GenAI', 'LLMs', 'Multimodal', 'Reasoning'],
  },
  {
    id: 'update-2',
    title: 'Agentic AI Workflows: Autonomous Coding & Multi-Agent Collaboration',
    category: 'Artificial Intelligence',
    description: 'How autonomous software agents plan, write tests, debug, and coordinate across repositories to accelerate modern software engineering lifecycles.',
    date: 'Oct 28, 2026',
    readTime: '5 min read',
    image: ASSETS.technologyUpdates.tutorialsSharing,
    tags: ['Agentic AI', 'DevTools', 'Automation', 'Python'],
  },
  {
    id: 'update-3',
    title: 'RAG System: Smarter AI with Real Information',
    category: 'Emerging Technologies',
    description: 'Retrieval-Augmented Generation combining external knowledge retrieval with AI generation for accurate, real-time and context-aware responses.',
    date: 'Oct 19, 2026',
    readTime: '5 min read',
    image: ASSETS.technologyUpdates.ragSystem,
    tags: ['RAG', 'Retrieval', 'Generative AI', 'LLMs'],
  },
];

export const FRIDAY_SESSIONS_DATA: FridaySession[] = [
  {
    id: 'friday-1',
    title: 'Hands-On Python & Deep Learning Lab',
    topic: 'Neural Networks & Computer Vision Basics',
    description: 'Weekly student-led deep-dive into model training, data preprocessing, and building your first image classification classifier using PyTorch.',
    date: 'Every Friday',
    time: '2:30 PM - 4:30 PM',
    speaker: 'Student Lead Mentors',
    venue: 'Computer Center Lab 3, SGSU Campus',
    image: ASSETS.workshops.friday1,
    level: 'Beginner',
  },
  {
    id: 'friday-2',
    title: 'Full-Stack Modern Web Engineering with React & Tailwind',
    topic: 'Component Driven Architecture & State Management',
    description: 'Interactive session exploring reactive frontend patterns, custom hooks, responsive Tailwind utility systems, and REST/WebSocket integration.',
    date: 'Upcoming Friday',
    time: '2:30 PM - 4:30 PM',
    speaker: 'Binary Battle Club Tech Team',
    venue: 'Innovation Auditorium, SGSU',
    image: ASSETS.workshops.fridayCollage,
    level: 'Intermediate',
  },
  {
    id: 'friday-3',
    title: 'Low Code No Code Web Development with STITCH AI',
    topic: 'Low Code / No Code AI Web Development',
    description: 'Special training session by Trainer Nihal Ali on building websites and applications with drag & drop interfaces and Stitch AI.',
    date: '11th September',
    time: '2:30 PM - 4:30 PM',
    speaker: 'Trainer Nihal Ali',
    venue: 'Computer Center Lab, SGSU Campus',
    image: '/images/workshops/nihal_ali_stitch_ai.jpg',
    level: 'Beginner',
  },
];

export interface RntuTraining {
  id: string;
  title: string;
  image: string;
  date: string;
  description: string;
}

export const RNTU_TRAININGS_DATA: RntuTraining[] = [
  {
    id: 'rntu-1',
    title: 'RNTU Delegation & Student Cohort',
    image: ASSETS.workshops.rntu1,
    date: 'Sep 17, 2026',
    description: 'Binary Battle Club mentor delegation and student participants at Rabindranath Tagore University.',
  },
  {
    id: 'rntu-2',
    title: 'Build AI Agents Without Code: From Idea to Action',
    image: ASSETS.workshops.rntu2,
    date: '17th September 2026',
    description: 'Special workshop organised by AI Centre of Excellence, Dept of Computer Science and Application, RNTU.',
  },
  {
    id: 'rntu-3',
    title: 'Hands-on AI Lab & Live Training Session',
    image: ASSETS.workshops.rntu3,
    date: 'Sep 17, 2026',
    description: 'Interactive no-code AI agent building lab session with university engineering students.',
  },
];
