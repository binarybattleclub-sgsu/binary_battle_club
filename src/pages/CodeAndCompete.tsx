import React, { useState } from 'react';
import { CodeXml, GraduationCap } from 'lucide-react';
import {
  FRIDAY_SESSIONS_DATA,
  RNTU_TRAININGS_DATA,
} from '../data/technologyUpdates';
import { EventModal, ModalData } from '../components/EventModal';

export const CodeAndCompete: React.FC = () => {
  const [modalData, setModalData] = useState<ModalData | null>(null);

  return (
    <div className="space-y-16">
      {/* Top Section Header */}
      <div className="bg-[#0a0f1e]/85 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-purple-500/10 text-purple-300 border border-purple-500/30 mb-3 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <GraduationCap size={14} />
            <span>LEARN & UPSKILL // SGSU</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2.5">
            Learn & Upskill
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
            "Learn together, experiment with technology and challenge yourself through hands-on workshops and competitions."
          </p>
        </div>
      </div>

      {/* 1. Friday Learning Sessions */}
      <section className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-950 via-[#0a0f1e] to-purple-950 text-white rounded-3xl p-8 sm:p-10 border border-white/10 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              WEEKLY_PRACTICE // LABORATORY
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-3 mb-2 tracking-tight">
              Friday – Learn, Explore & Experiment
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              "Weekly student-driven workshops and practical learning sessions conducted every Friday."
            </p>
            <p className="mt-2 text-xs text-cyan-300/80 font-mono">
              Dedicated to hands-on coding, live debugging, and global certification integration across semesters.
            </p>
          </div>
        </div>

        {/* Workshop Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FRIDAY_SESSIONS_DATA.map((session) => (
            <div
              key={session.id}
              onClick={() =>
                setModalData({
                  title: session.title,
                  category: session.topic,
                  date: `${session.date} (${session.time})`,
                  venue: session.venue,
                  organizer: session.speaker,
                  description: session.description,
                  highlights: [
                    'Student-led hands-on interactive lab exercises',
                    'Direct code walkthroughs and debugging support',
                    'Open for all SGSU enrolled students across all semesters',
                  ],
                  gallery:
                    session.id === 'friday-2'
                      ? [
                          session.image,
                          '/images/workshops/friday_workshop_3.jpg',
                          '/images/workshops/friday_workshop_2.jpg',
                        ]
                      : [session.image],
                })
              }
              className="bg-[#0a0f1e]/85 backdrop-blur-xl rounded-3xl border border-white/10 shadow-lg hover:border-indigo-500/40 hover:shadow-[0_0_35px_rgba(99,102,241,0.3)] transition-all overflow-hidden group cursor-pointer p-3 sm:p-4 flex flex-col items-center justify-center"
            >
              <img
                src={session.image}
                alt={session.title}
                className="w-full h-auto object-contain rounded-2xl group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </section>

      {/* 2. RNTU Training Sessions */}
      <section className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-950 via-[#0a0f1e] to-purple-950 text-white rounded-3xl p-8 sm:p-10 border border-white/10 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              CAMPUS_OUTREACH // RNTU_PARTNERSHIP
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-3 mb-2 tracking-tight">
              Binary Battle Club – Trainings RNTU
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              Global Certification Integration all Semester
            </p>
          </div>
        </div>

        {/* RNTU Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RNTU_TRAININGS_DATA.map((item) => (
            <div
              key={item.id}
              onClick={() =>
                setModalData({
                  title: item.title,
                  category: 'Campus Outreach',
                  date: item.date,
                  venue: 'Rabindranath Tagore University (RNTU)',
                  description: item.description,
                  highlights: [
                    'Binary Battle Club Cross-Campus Technology Outreach',
                    'Build AI Agents Without Code: From Idea to Action',
                    'Hands-on lab training with university students and faculty',
                  ],
                  gallery: [item.image],
                })
              }
              className="bg-[#0a0f1e]/85 backdrop-blur-xl rounded-3xl border border-white/10 shadow-lg hover:border-cyan-500/40 hover:shadow-[0_0_35px_rgba(0,242,254,0.25)] transition-all overflow-hidden group cursor-pointer p-3 sm:p-4 flex flex-col items-center justify-center"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-auto object-contain rounded-2xl group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Details modal */}
      <EventModal
        isOpen={Boolean(modalData)}
        onClose={() => setModalData(null)}
        data={modalData}
      />
    </div>
  );
};
