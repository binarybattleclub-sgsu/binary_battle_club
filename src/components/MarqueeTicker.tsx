import React from 'react';

export const MarqueeTicker: React.FC = () => {
  const items = [
    'SCOPE GLOBAL SKILLS UNIVERSITY',
    '36TH NATIONAL WORKSKILLS CHAMPIONS',
    '12H & 24H OVERNIGHT HACKATHONS',
    'GOOGLE-POWERED INNOVATION SPRINT',
    'WEEKLY FRIDAY HANDS-ON LABS',
    'BGI HACKATHON 1ST PLACE WINNERS',
    'CII 2026 WEB TECHNOLOGY HONORS',
    'INNOVERSE 2024 SHOWCASE DELEGATION',
    'SCHOOL OF FUTURE SKILLS & IT',
    'THINK. CODE. CREATE. COMPETE.',
  ];

  return (
    <div className="relative w-full overflow-hidden py-3.5 bg-[#08090E]/90 border-y border-white/[0.08] backdrop-blur-md marquee-container select-none">
      <div className="flex w-max animate-marquee space-x-8 text-xs font-medium tracking-[0.2em] text-slate-300 uppercase">
        {[...items, ...items].map((text, idx) => (
          <div key={idx} className="flex items-center space-x-8 shrink-0">
            <span className="hover:text-rose-400 transition-colors cursor-default">
              {text}
            </span>
            <span className="text-rose-500 font-bold opacity-80">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
};
