import { ASSETS } from './assets';

export interface AchievementItem {
  id: string;
  title: string;
  category: 'Hackathon Achievements' | 'National Competitions' | 'Technical Competitions' | 'Project Achievements' | 'Other Recognitions';
  studentOrTeamName: string;
  competitionName: string;
  date: string;
  award: string;
  image: string;
  gallery?: string[];
  description: string;
  institution: string;
  badgeType: 'trophy' | 'medal' | 'star' | 'award';
  link?: string;
}

export const ACHIEVEMENTS_DATA: AchievementItem[] = [
  {
    id: 'bgi-hackathon-winners',
    title: 'BGI Hackathon Winners',
    category: 'Hackathon Achievements',
    studentOrTeamName: 'Binary Battle Club Student Team',
    competitionName: 'BGI Hackathon',
    date: '13th & 14th May',
    award: 'Winners & Top Honors',
    image: ASSETS.achievements.bgi1,
    gallery: [
      ASSETS.achievements.bgi1,
      ASSETS.achievements.bgi2,
      ASSETS.achievements.bgi3,
    ],
    description: 'The student developer team from Scope Global Skills University secured top winning honors at the BGI Hackathon after two rigorous days of continuous innovation, technical prototyping, and final stage presentations.',
    institution: 'Scope Global Skills University',
    badgeType: 'trophy',
  },
  {
    id: 'national-workskills-champions',
    title: 'National Champions – 36th National WorkSkills Competition',
    category: 'National Competitions',
    studentOrTeamName: 'SGSU Student Champions',
    competitionName: '36th National WorkSkills Competition',
    date: 'National Level Competition',
    award: 'National Champions',
    image: ASSETS.achievements.nationalWorkskills1,
    gallery: [
      ASSETS.achievements.nationalWorkskills1,
      ASSETS.achievements.nationalWorkskills2,
    ],
    description: 'Securing the highest national honors, our students proved their technical competence, agility, and hands-on skill excellence at the prestigious 36th National WorkSkills Competition, bringing proud accolades to the university.',
    institution: 'National WorkSkills Forum',
    badgeType: 'medal',
  },
  {
    id: 'innoverse-2024-participation',
    title: 'Excellence & Participation in INNOverse 2024',
    category: 'Technical Competitions',
    studentOrTeamName: 'Binary Battle Club Innovation Delegation',
    competitionName: 'INNOverse 2024',
    date: '2024 Edition',
    award: 'Competitive Finalists & Showcase Recognition',
    image: ASSETS.achievements.innoverse1,
    gallery: [
      ASSETS.achievements.innoverse1,
      ASSETS.achievements.innoverse2,
      ASSETS.achievements.innoverse3,
      ASSETS.achievements.innoverse4,
    ],
    description: 'Demonstrating high-caliber engineering creativity, Binary Battle Club members participated in INNOverse 2024, presenting cutting-edge technology prototypes, exchanging ideas with fellow innovators, and garnering high evaluation scores.',
    institution: 'INNOverse Innovation Conclave',
    badgeType: 'star',
  },
  {
    id: 'four-teams-final-round',
    title: 'Four Teams Selected for Final Round',
    category: 'Technical Competitions',
    studentOrTeamName: 'Four Student Teams (School of Future Skills and IT)',
    competitionName: 'State & Regional Technical Evaluation Rounds',
    date: '26th & 27th September',
    award: 'Finalist Selections (4 Qualified Teams)',
    image: ASSETS.achievements.finalRoundSelection,
    gallery: [
      ASSETS.achievements.finalRoundSelection,
    ],
    description: 'An exceptional triumph for the School of Future Skills and Information Technology: four distinct student teams qualified through competitive rounds to represent the university in the final championship stage.',
    institution: 'School of Future Skills and Information Technology, SGSU',
    badgeType: 'award',
  },
  {
    id: 'cii-2026-siddhesh-kewate',
    title: 'CII – 2026 Web Technology Recognition',
    category: 'Other Recognitions',
    studentOrTeamName: 'Siddhesh Kewate',
    competitionName: 'CII – 2026',
    date: 'CII Technical Championship',
    award: 'Web Technology Excellence',
    image: ASSETS.achievements.ciiSiddhesh,
    gallery: [
      ASSETS.achievements.ciiSiddhesh,
    ],
    description: 'Siddhesh Kewate represented Scope Global Skills University at the CII 2026 competition in the Web Technology domain, showcasing high standards of modern web design, responsive implementation, and software craftsmanship.',
    institution: 'Confederation of Indian Industry (CII)',
    badgeType: 'medal',
  },
  {
    id: 'cyber-shiksha-sgsu',
    title: 'Cyber Shiksha SGSU — Cybersecurity Excellence & Training Portal',
    category: 'Other Recognitions',
    studentOrTeamName: 'SGSU Cyber Security Division & Binary Battle Club',
    competitionName: 'Cyber Shiksha University Initiative',
    date: 'Active University Portal',
    award: 'Official Cybersecurity Platform',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'The official Cyber Shiksha SGSU platform and cybersecurity initiative, empowering university students with hands-on ethical hacking, digital forensics, network defense, and cybersecurity training.',
    institution: 'Scope Global Skills University',
    badgeType: 'award',
    link: 'https://cybershikshasgsu.netlify.app/',
  },
];
