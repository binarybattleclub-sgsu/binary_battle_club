import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Filter,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { ACHIEVEMENTS_DATA, AchievementItem } from '../data/achievements';
import { AchievementCard } from '../components/AchievementCard';
import { EventModal, ModalData } from '../components/EventModal';

export const Achievements: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const categories = [
    'All',
    'Hackathon Achievements',
    'National Competitions',
    'Technical Competitions',
    'Other Recognitions',
  ];

  const filteredAchievements =
    selectedCategory === 'All'
      ? ACHIEVEMENTS_DATA
      : ACHIEVEMENTS_DATA.filter((a) => a.category === selectedCategory);

  const handleOpenAchievementDetails = (item: AchievementItem) => {
    setModalData({
      title: item.title,
      category: item.category,
      award: item.award,
      date: item.date,
      venue: item.competitionName,
      organizer: item.studentOrTeamName,
      description: item.description,
      highlights: [
        `Honored recognition: ${item.award}`,
        `Competition Stage: ${item.competitionName}`,
        `Representing Scope Global Skills University (SGSU)`,
        `Documented & verified in official club records`,
      ],
      gallery: item.gallery || [item.image],
    });
  };

  return (
    <div className="space-y-16 text-[#DCE6F5]">
      {/* Page Header */}
      <div className="bg-[#101D35]/85 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-[#243650] shadow-[0_12px_35px_rgba(8,13,24,0.8)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#2563EB]/15 text-[#38BDF8] border border-[#2563EB]/30 mb-3 shadow-[0_0_15px_rgba(37,99,235,0.15)]">
            <Trophy size={14} />
            <span>HALL_OF_FAME // HONORS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#DCE6F5] tracking-tight mb-2.5">
            Our Achievements
          </h1>
          <p className="text-xs sm:text-sm text-[#9FB0C8] leading-relaxed font-normal">
            &ldquo;Celebrating the ideas, efforts and accomplishments of our student community.&rdquo;
          </p>
        </div>

        {/* Cyber Shiksha SGSU Icon Link */}
        <a
          href="https://cybershikshasgsu.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#101D35] hover:bg-[#172945] border border-[#243650] hover:border-[#38BDF8]/40 text-[#DCE6F5] shadow-[0_4px_20px_rgba(8,13,24,0.8)] transition-all group shrink-0"
          title="Visit Cyber Shiksha SGSU"
        >
          <div className="w-10 h-10 rounded-xl bg-[#080D18] border border-[#243650] text-[#38BDF8] flex items-center justify-center group-hover:scale-105 transition-transform shadow-inner">
            <ShieldCheck size={20} className="text-[#38BDF8]" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-mono font-bold text-[#DCE6F5] flex items-center gap-1.5">
              <span>Cyber Shiksha SGSU</span>
              <ExternalLink size={12} className="text-[#38BDF8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
            <span className="text-[11px] text-[#38BDF8] font-mono">
              cybershikshasgsu.netlify.app
            </span>
          </div>
        </a>
      </div>

      {/* Filter and Content Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#DCE6F5]">
              Hall of Triumphs & Competitions
            </h2>
            <p className="text-xs sm:text-sm text-[#9FB0C8] mt-1 font-mono">
              Primary records extracted directly from official university events and presentations.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <Filter size={15} className="text-[#9FB0C8] shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#2563EB] text-[#DCE6F5] shadow-[0_0_15px_rgba(37,99,235,0.3)] border border-[#38BDF8]/40'
                    : 'bg-[#101D35] text-[#9FB0C8] hover:text-[#DCE6F5] hover:bg-[#172945] border border-[#243650]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((item) => (
            <AchievementCard
              key={item.id}
              achievement={item}
              onOpenDetails={handleOpenAchievementDetails}
            />
          ))}
        </div>
      </section>

      {/* Verified Achievement Timeline Summary */}
      <section className="bg-[#101D35]/85 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-[#243650] shadow-lg space-y-6">
        <div className="flex items-center gap-2">
          <Award size={20} className="text-[#38BDF8]" />
          <h3 className="text-lg sm:text-xl font-bold text-[#DCE6F5]">
            Official University Achievement Highlights
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-[#080D18]/70 border border-[#243650] hover:border-[#38BDF8]/40 transition-all space-y-1">
            <span className="font-bold text-[#38BDF8] text-sm">BGI Hackathon Winners</span>
            <p className="text-[#DCE6F5]">13th & 14th May • Trophy & Top Honors</p>
            <p className="text-[#9FB0C8] text-[11px]">Scope Global Skills University Student Team</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#080D18]/70 border border-[#243650] hover:border-[#38BDF8]/40 transition-all space-y-1">
            <span className="font-bold text-[#38BDF8] text-sm">36th National WorkSkills</span>
            <p className="text-[#DCE6F5]">National Champions • Prestigious Gold Honors</p>
            <p className="text-[#9FB0C8] text-[11px]">Scope Global Skills University</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#080D18]/70 border border-[#243650] hover:border-[#38BDF8]/40 transition-all space-y-1">
            <span className="font-bold text-[#38BDF8] text-sm">Four Teams Final Round</span>
            <p className="text-[#DCE6F5]">26th & 27th September • Finalist Selections</p>
            <p className="text-[#9FB0C8] text-[11px]">School of Future Skills and IT (SGSU)</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#080D18]/70 border border-[#243650] hover:border-[#38BDF8]/40 transition-all space-y-1">
            <span className="font-bold text-[#38BDF8] text-sm">INNOverse 2024 Showcase</span>
            <p className="text-[#DCE6F5]">2024 Edition • Technical Showcase Delegation</p>
            <p className="text-[#9FB0C8] text-[11px]">Binary Battle Club Innovation Squad</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#080D18]/70 border border-[#243650] hover:border-[#38BDF8]/40 transition-all space-y-1">
            <span className="font-bold text-[#38BDF8] text-sm">CII – 2026 Web Technology</span>
            <p className="text-[#DCE6F5]">Siddhesh Kewate • Web Technology Excellence</p>
            <p className="text-[#9FB0C8] text-[11px]">Confederation of Indian Industry (CII)</p>
          </div>

          <a
            href="https://cybershikshasgsu.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-[#080D18]/70 hover:bg-[#172945] border border-[#243650] hover:border-[#38BDF8]/40 transition-all space-y-1 group block"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#38BDF8] text-sm flex items-center gap-1.5">
                Cyber Shiksha SGSU
                <ExternalLink size={13} className="text-[#38BDF8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
              <ShieldCheck size={16} className="text-[#38BDF8]" />
            </div>
            <p className="text-[#DCE6F5]">Cybersecurity Initiative & Training Portal</p>
            <p className="text-[#38BDF8]/80 text-[11px] underline">cybershikshasgsu.netlify.app ↗</p>
          </a>
        </div>
      </section>

      {/* Modal for detailed photos */}
      <EventModal
        isOpen={Boolean(modalData)}
        onClose={() => setModalData(null)}
        data={modalData}
      />
    </div>
  );
};
