import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import {
  FRIDAY_SESSIONS_DATA,
  RNTU_TRAININGS_DATA,
} from '../data/technologyUpdates';
import { EventModal, ModalData } from '../components/EventModal';
import { YouTubeLearningSection } from '../components/youtube/YouTubeLearningSection';

export const CodeAndCompete: React.FC = () => {
  const [modalData, setModalData] = useState<ModalData | null>(null);

  return (
    <div className="space-y-16 text-[#DCE6F5]">
      {/* Top Section Header */}
      <div className="bg-[#101D35]/85 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-[#243650] shadow-[0_12px_35px_rgba(8,13,24,0.8)]">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#2563EB]/15 text-[#38BDF8] border border-[#2563EB]/30 mb-3 shadow-[0_0_15px_rgba(37,99,235,0.15)]">
            <GraduationCap size={14} />
            <span>LEARN & UPSKILL // SGSU</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#DCE6F5] tracking-tight mb-2.5">
            Learn & Upskill
          </h1>
          <p className="text-xs sm:text-sm text-[#9FB0C8] leading-relaxed font-normal">
            &ldquo;Learn together, experiment with technology and challenge yourself through hands-on workshops and competitions.&rdquo;
          </p>
        </div>
      </div>

      {/* 1. Friday Learning Sessions */}
      <section className="space-y-6">
        <div className="bg-gradient-to-r from-[#101D35] via-[#13223d] to-[#101D35] text-[#DCE6F5] rounded-3xl p-8 sm:p-10 border border-[#243650] shadow-xl relative overflow-hidden">
          <div className="max-w-3xl">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#2563EB]/15 text-[#38BDF8] border border-[#2563EB]/30">
              WEEKLY_PRACTICE // LABORATORY
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-3 mb-2 tracking-tight">
              Friday – Learn, Explore & Experiment
            </h2>
            <p className="text-xs sm:text-sm text-[#9FB0C8] leading-relaxed font-normal">
              &ldquo;Weekly student-driven workshops and practical learning sessions conducted every Friday.&rdquo;
            </p>
            <p className="mt-2 text-xs text-[#38BDF8] font-mono">
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
              className="bg-[#101D35]/85 backdrop-blur-xl rounded-3xl border border-[#243650] shadow-lg hover:border-[#38BDF8]/40 hover:bg-[#172945]/90 hover:shadow-[0_12px_35px_rgba(8,13,24,0.8),0_0_20px_rgba(37,99,235,0.18)] transition-all overflow-hidden group cursor-pointer p-3 sm:p-4 flex flex-col items-center justify-center"
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

      {/* 2. YouTube Learning Library */}
      <YouTubeLearningSection />

      {/* 3. RNTU Training Sessions */}
      <section className="space-y-6">
        <div className="bg-gradient-to-r from-[#101D35] via-[#13223d] to-[#101D35] text-[#DCE6F5] rounded-3xl p-8 sm:p-10 border border-[#243650] shadow-xl relative overflow-hidden">
          <div className="max-w-3xl">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#2563EB]/15 text-[#38BDF8] border border-[#2563EB]/30">
              CAMPUS_OUTREACH // RNTU_PARTNERSHIP
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-3 mb-2 tracking-tight">
              Binary Battle Club – Trainings RNTU
            </h2>
            <p className="text-xs sm:text-sm text-[#9FB0C8] leading-relaxed font-normal">
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
              className="bg-[#101D35]/85 backdrop-blur-xl rounded-3xl border border-[#243650] shadow-lg hover:border-[#38BDF8]/40 hover:bg-[#172945]/90 hover:shadow-[0_12px_35px_rgba(8,13,24,0.8),0_0_20px_rgba(37,99,235,0.18)] transition-all overflow-hidden group cursor-pointer p-3 sm:p-4 flex flex-col items-center justify-center"
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
