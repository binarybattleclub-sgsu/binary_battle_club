import { ASSETS } from './assets';

export interface HackathonEvent {
  id: string;
  title: string;
  duration: string;
  status: 'Completed' | 'Upcoming / Planned';
  venue: string;
  date?: string;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  gallery: string[];
  highlights: string[];
  stats: {
    label: string;
    value: string;
  }[];
  isFeaturedUpcoming?: boolean;
}

export const HACKATHONS_DATA: HackathonEvent[] = [
  {
    id: 'sgsu-internal-12hr',
    title: '12-Hour Internal Hackathon',
    duration: '12 Hours Intensive',
    status: 'Completed',
    venue: 'Scope Global Skills University (SGSU), Bhopal',
    date: 'Conducted at SGSU Campus',
    shortDescription: 'An intensive in-house coding and innovation sprint where students collaborated across disciplines, engineered working prototypes, and defended their technical architecture.',
    fullDescription: 'The 12-Hour Internal Hackathon brought together dynamic teams from the School of Future Skills and Information Technology. Participating students were challenged to rapidly ideate, architect, develop, and present functional prototypes addressing real-world domain problems. Supported by continuous mentorship, code evaluations, and peer code reviews, teams demonstrated remarkable dedication and technical ingenuity.',
    coverImage: ASSETS.hackathons.sgsu1,
    gallery: [
      ASSETS.hackathons.sgsu1,
      ASSETS.hackathons.sgsu2,
      ASSETS.hackathons.sgsu3,
      ASSETS.hackathons.sgsu4,
      ASSETS.hackathons.sgsu5,
      ASSETS.hackathons.sgsu6,
      ASSETS.hackathons.sgsu7,
      ASSETS.hackathons.sgsu8,
    ],
    highlights: [
      'Multi-disciplinary student development squads',
      'Rapid prototyping across web, AI, and mobile stacks',
      'Live technical presentations before university faculty & judges',
      'Continuous mentorship and code reviews throughout the 12-hour sprint',
    ],
    stats: [
      { label: 'Sprint Duration', value: '12 Hours' },
      { label: 'Campus Venue', value: 'SGSU Labs & Auditorium' },
      { label: 'Focus Areas', value: 'Web, AI, Cloud' },
      { label: 'Outcome', value: 'Working Prototypes' },
    ],
  },
  {
    id: 'navonamesh-external-24hr',
    title: '24-Hour Hackathon – Navonamesh',
    duration: '24 Hours Non-Stop',
    status: 'Completed',
    venue: 'External Innovation Center / Navonamesh',
    date: 'Navonamesh Flagship Event',
    shortDescription: 'A high-energy 24-hour overnight hackathon featuring external competitive participation, collaborative problem solving, and intensive prototyping under pressure.',
    fullDescription: 'Navonamesh was a grueling 24-hour non-stop hackathon where Binary Battle Club innovators represented the university alongside top competitive teams. Working through the night, participants built end-to-end full-stack systems, trained machine learning pipelines, and presented polished pitches to seasoned industry evaluators.',
    coverImage: ASSETS.hackathons.navonamesh1,
    gallery: [
      ASSETS.hackathons.navonamesh1,
      ASSETS.hackathons.navonamesh2,
      ASSETS.hackathons.navonamesh3,
      ASSETS.hackathons.navonamesh4,
      ASSETS.hackathons.navonamesh5,
      ASSETS.hackathons.navonamesh6,
    ],
    highlights: [
      'Overnight 24-hour competitive coding sprint',
      'High-impact problem statements with real-world validation',
      'Intensive industry jury reviews and pitch rounds',
      'Showcasing SGSU talent on prominent competitive stages',
    ],
    stats: [
      { label: 'Sprint Duration', value: '24 Hours' },
      { label: 'Event Flagship', value: 'Navonamesh' },
      { label: 'Participation', value: 'Competitive External' },
      { label: 'Recognition', value: 'High Jury Praise' },
    ],
  },
];
