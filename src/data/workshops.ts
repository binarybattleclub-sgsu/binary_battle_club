import { ASSETS } from './assets';

export interface WorkshopEvent {
  id: string;
  title: string;
  category: 'AI Workshops' | 'Coding Workshops' | 'Masterclasses' | 'External Workshops';
  description: string;
  longDescription: string;
  date: string;
  venue: string;
  instructorOrOrganizer: string;
  thumbnail: string;
  gallery: string[];
  highlights: string[];
  isExternal?: boolean;
  institution?: string;
  attendeesCount: number;
}

export const WORKSHOPS_DATA: WorkshopEvent[] = [
  {
    id: 'gemini-ai-masterclass',
    title: 'Gemini AI Masterclass',
    category: 'AI Workshops',
    description: 'An immersive hands-on masterclass exploring Gemini API models, structured prompt engineering, and building intelligent web applications.',
    longDescription: 'The Gemini AI Masterclass introduced students to the cutting edge of modern generative models. Participants explored multimodal inputs, system prompt optimization, function calling, and learned how to integrate generative intelligence directly into modern client-side frontend architectures.',
    date: 'August 18, 2026',
    venue: 'Scope Global Skills University, Bhopal',
    instructorOrOrganizer: 'Binary Battle Club Technical Leads',
    thumbnail: ASSETS.workshops.friday1,
    gallery: [
      ASSETS.workshops.friday1,
      ASSETS.workshops.friday2,
      ASSETS.workshops.friday4,
      ASSETS.workshops.friday5,
    ],
    highlights: [
      'Deep dive into Gemini Multimodal APIs',
      'Live code demonstrations and prompt engineering workshops',
      'Over 60+ enthusiastic student developers participating',
      'Interactive Q&A on AI product roadmaps',
    ],
    attendeesCount: 65,
  },
  {
    id: 'friday-workshop',
    title: 'Binary Battle Club Workshop – Trainings Friday',
    category: 'Coding Workshops',
    description: 'Student-led practical coding sessions conducted every Friday, focusing on programming fundamentals and global certification integration.',
    longDescription: 'A regular student-driven technology and hands-on laboratory initiative where senior students and club mentors deliver practical tutorials on data structures, algorithmic thinking, and modern software design patterns. Embedded with global certification preparation across all academic semesters.',
    date: 'Weekly Every Friday',
    venue: 'Computer Center Lab, SGSU Bhopal',
    instructorOrOrganizer: 'By the Students, For the Students',
    thumbnail: ASSETS.workshops.friday2,
    gallery: [
      ASSETS.workshops.friday2,
      ASSETS.workshops.friday3,
      ASSETS.workshops.friday5,
      ASSETS.workshops.friday1,
    ],
    highlights: [
      'Weekly peer-to-peer programming mentorship',
      'Semester-long Global Certification roadmap integration',
      'Hands-on lab experiments with instant peer code reviews',
      'Direct preparation for regional and national hackathons',
    ],
    attendeesCount: 85,
  },
  {
    id: 'google-stitch-workshop',
    title: 'Google Stitch Workshop',
    category: 'Masterclasses',
    description: 'Collaborative technical workshop bridging modern developer technologies, web ecosystems, and open-source Google developer tooling.',
    longDescription: 'The Google Stitch Workshop brought together passionate developers to explore seamless integration across Google tools, web frameworks, and cloud developer platforms. Students gained practical insights into deploying scalable web solutions and building developer-first products.',
    date: 'September 08, 2026',
    venue: 'Auditorium Hall, Scope Global Skills University',
    instructorOrOrganizer: 'Google Developer Advocates & University Team',
    thumbnail: ASSETS.workshops.friday4,
    gallery: [
      ASSETS.workshops.friday4,
      ASSETS.workshops.friday1,
      ASSETS.workshops.friday3,
      ASSETS.technologyUpdates.tutorialsSharing,
    ],
    highlights: [
      'Comprehensive overview of modern Google developer ecosystems',
      'Cloud deployment pipelines and collaborative coding workflows',
      'Interactive student hack sprint and design critique',
      'Special certificates of completion for active attendees',
    ],
    attendeesCount: 95,
  },
  {
    id: 'ai-leadership-challenge',
    title: 'AI Leadership Challenge & Symposium',
    category: 'AI Workshops',
    description: 'Empowering future technology leaders through competitive case studies, algorithmic problem solving, and ethical AI deployment.',
    longDescription: 'A premier intellectual and technical challenge designed to nurture student technology leaders. Teams tackled real-world socio-technical case studies, proposed AI-powered solutions, and defended their technical architecture before an expert jury of university faculty and industry experts.',
    date: 'September 22, 2026',
    venue: 'School of Future Skills and IT, SGSU',
    instructorOrOrganizer: 'Binary Battle Club & SGSU Faculty',
    thumbnail: ASSETS.workshops.friday3,
    gallery: [
      ASSETS.workshops.friday3,
      ASSETS.workshops.friday5,
      ASSETS.achievements.finalRoundSelection,
      ASSETS.workshops.friday2,
    ],
    highlights: [
      'Cross-disciplinary case studies combining technology and management',
      'Student presentations on responsible AI governance',
      'Mentorship from senior faculty and tech community leaders',
      'Fostering leadership mindset in engineering undergraduates',
    ],
    attendeesCount: 70,
  },
  {
    id: 'rntu-tech-workshops',
    title: 'Binary Battle Club – Trainings RNTU',
    category: 'External Workshops',
    description: 'Technical training programs and global certification integration workshops delivered across partner campuses including RNTU.',
    longDescription: 'Extending the mission beyond SGSU, Binary Battle Club led intensive technical training sessions at Rabindranath Tagore University (RNTU). The sessions covered modern web technology, algorithmic reasoning, and global certification integration across semesters.',
    date: 'October 14, 2026',
    venue: 'Rabindranath Tagore University (RNTU) Campus',
    instructorOrOrganizer: 'Binary Battle Club Outreach Delegates',
    thumbnail: ASSETS.workshops.rntu1,
    gallery: [
      ASSETS.workshops.rntu1,
      ASSETS.workshops.rntu2,
      ASSETS.workshops.rntu3,
    ],
    highlights: [
      'Inter-university student knowledge exchange',
      'Comprehensive hands-on training for RNTU students',
      'Focus on Global Certification integration',
      'Showcasing student-led pedagogical excellence',
    ],
    isExternal: true,
    institution: 'Rabindranath Tagore University (RNTU)',
    attendeesCount: 120,
  },
  {
    id: 'college-outreach-sessions',
    title: 'Collegiate Tech Outreach & Student-Led Sessions',
    category: 'External Workshops',
    description: 'Technical sessions, coding workshops, and knowledge exchanges conducted across premier regional engineering colleges.',
    longDescription: 'A multi-campus technical outreach initiative reaching students across Rajiv Gandhi College, LNCT College, and BSS College. Binary Battle Club delegates shared practical insights on web frameworks, hackathon preparation, and competitive programming.',
    date: 'October 25, 2026',
    venue: 'Rajiv Gandhi College, LNCT College & BSS College',
    instructorOrOrganizer: 'Binary Battle Club Ambassador Network',
    thumbnail: ASSETS.workshops.outreach1,
    gallery: [
      ASSETS.workshops.outreach1,
      ASSETS.workshops.outreach2,
      ASSETS.workshops.outreach3,
      ASSETS.workshops.rntu2,
    ],
    highlights: [
      'Conducting outreach at Rajiv Gandhi College, LNCT College, and BSS College',
      'Inspiring first-year engineering students to embrace open-source',
      'Practical demonstrations of frontend tooling and competitive platforms',
      'Building regional student developer coalitions',
    ],
    isExternal: true,
    institution: 'Rajiv Gandhi College | LNCT College | BSS College',
    attendeesCount: 150,
  },
];

export const BEYOND_CAMPUS_DATA: WorkshopEvent[] = WORKSHOPS_DATA.filter(w => w.isExternal);
