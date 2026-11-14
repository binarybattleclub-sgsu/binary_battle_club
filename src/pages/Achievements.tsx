import React, { useState } from 'react';
import {
  Trophy,
  Medal,
  Award,
  Filter,
  Calendar,
  Sparkles,
  MapPin,
  CheckCircle2,
  Eye,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
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
    <div className="space-y-16">
      {/* Page Header */}
      <div className="bg-[#0a0f1e]/85 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30 mb-3 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Trophy size={14} />
            <span>HALL_OF_FAME // HONORS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2.5">
            Our Achievements
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
            "Celebrating the ideas, efforts and accomplishments of our student community."
          </p>
        </div>

        {/* Cyber Shiksha SGSU Icon Link */}
        <a
          href="https://cybershikshasgsu.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-purple-950/40 hover:from-cyan-900/50 hover:via-indigo-900/40 hover:to-purple-900/50 border border-cyan-500/30 hover:border-cyan-400 text-white shadow-[0_0_20px_rgba(0,242,254,0.15)] hover:shadow-[0_0_30px_rgba(0,242,254,0.35)] transition-all group shrink-0"
          title="Visit Cyber Shiksha SGSU"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
            <ShieldCheck size={20} className="text-cyan-300" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
              <span>Cyber Shiksha SGSU</span>
              <ExternalLink size={12} className="text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
            <span className="text-[11px] text-cyan-400/80 font-mono">
              cybershikshasgsu.netlify.app
            </span>
          </div>
        </a>
      </div>

      {/* Filter and Content Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Hall of Triumphs & Competitions
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
              Primary records extracted directly from official university events and presentations.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <Filter size={15} className="text-slate-500 shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.4)] border border-amber-400/30'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
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
      <section className="bg-[#0a0f1e]/85 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-white/10 shadow-lg space-y-6">
        <div className="flex items-center gap-2">
          <Award size={20} className="text-amber-400" />
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Official University Achievement Highlights
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-amber-500/30 space-y-1">
            <span className="font-bold text-amber-300 text-sm">BGI Hackathon Winners</span>
            <p className="text-slate-300">13th & 14th May • Trophy & Top Honors</p>
            <p className="text-slate-500 text-[11px]">Scope Global Skills University Student Team</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-cyan-500/30 space-y-1">
            <span className="font-bold text-cyan-300 text-sm">36th National WorkSkills</span>
            <p className="text-slate-300">National Champions • Prestigious Gold Honors</p>
            <p className="text-slate-500 text-[11px]">Scope Global Skills University</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-purple-500/30 space-y-1">
            <span className="font-bold text-purple-300 text-sm">Four Teams Final Round</span>
            <p className="text-slate-300">26th & 27th September • Finalist Selections</p>
            <p className="text-slate-500 text-[11px]">School of Future Skills and IT (SGSU)</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-emerald-500/30 space-y-1">
            <span className="font-bold text-emerald-300 text-sm">INNOverse 2024 Showcase</span>
            <p className="text-slate-300">2024 Edition • Technical Showcase Delegation</p>
            <p className="text-slate-500 text-[11px]">Binary Battle Club Innovation Squad</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-sky-500/30 space-y-1">
            <span className="font-bold text-sky-300 text-sm">CII – 2026 Web Technology</span>
            <p className="text-slate-300">Siddhesh Kewate • Web Technology Excellence</p>
            <p className="text-slate-500 text-[11px]">Confederation of Indian Industry (CII)</p>
          </div>

          <a
            href="https://cybershikshasgsu.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-gradient-to-tr from-cyan-950/30 to-indigo-950/30 hover:from-cyan-900/40 hover:to-indigo-900/40 border border-cyan-500/40 hover:border-cyan-400 transition-all space-y-1 group block"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-cyan-300 text-sm flex items-center gap-1.5">
                Cyber Shiksha SGSU
                <ExternalLink size={13} className="text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
              <ShieldCheck size={16} className="text-cyan-400" />
            </div>
            <p className="text-slate-300">Cybersecurity Initiative & Training Portal</p>
            <p className="text-cyan-400/80 text-[11px] underline">cybershikshasgsu.netlify.app ↗</p>
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
