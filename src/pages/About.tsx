import React from 'react';
import {
  Target,
  Eye,
  CheckCircle2,
  Cpu,
  GraduationCap,
  Rocket,
  Trophy,
  Sparkles,
} from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';

export const About: React.FC = () => {
  const pillars = [
    {
      label: '01. Explore & Share',
      action: 'Discover technologies. Share knowledge.',
      icon: Cpu,
      iconColor: 'text-cyan-300',
      labelColor: 'text-cyan-400',
      arrowHover: 'group-hover:text-cyan-300',
      glow: 'group-hover:shadow-[0_8px_30px_rgba(0,242,254,0.35)]',
      squircle:
        'bg-gradient-to-br from-[#0c2b3a] to-[#041118] border border-cyan-400/30 shadow-[0_8px_20px_rgba(0,242,254,0.18)]',
    },
    {
      label: '02. Learn & Upskill',
      action: 'Train. Practice. Develop skills.',
      icon: GraduationCap,
      iconColor: 'text-purple-300',
      labelColor: 'text-purple-400',
      arrowHover: 'group-hover:text-purple-300',
      glow: 'group-hover:shadow-[0_8px_30px_rgba(168,85,247,0.35)]',
      squircle:
        'bg-gradient-to-br from-[#2a1444] to-[#0f051c] border border-purple-400/30 shadow-[0_8px_20px_rgba(168,85,247,0.18)]',
    },
    {
      label: '03. Create & Showcase',
      action: 'Build projects. Demonstrate innovation.',
      icon: Rocket,
      iconColor: 'text-sky-300',
      labelColor: 'text-sky-400',
      arrowHover: 'group-hover:text-sky-300',
      glow: 'group-hover:shadow-[0_8px_30px_rgba(56,189,248,0.35)]',
      squircle:
        'bg-gradient-to-br from-[#0c253d] to-[#040e1a] border border-sky-400/30 shadow-[0_8px_20px_rgba(56,189,248,0.18)]',
    },
    {
      label: '04. Events & Achievements',
      action: 'Participate. Compete. Get recognised.',
      icon: Trophy,
      iconColor: 'text-amber-300',
      labelColor: 'text-amber-400',
      arrowHover: 'group-hover:text-amber-300',
      glow: 'group-hover:shadow-[0_8px_30px_rgba(245,158,11,0.35)]',
      squircle:
        'bg-gradient-to-br from-[#30210a] to-[#120a02] border border-amber-400/30 shadow-[0_8px_20px_rgba(245,158,11,0.18)]',
    },
  ];

  const missionPoints = [
    'Develop strong programming, computational thinking and problem-solving skills.',
    'Explore emerging technologies, including Artificial Intelligence, Data Science, Web Development and emerging digital innovations.',
    'Participate in coding competitions, hackathons, technical challenges and innovation events.',
    'Build practical projects and technology solutions addressing real-world problems.',
    'Learn through peer-to-peer knowledge sharing, expert interactions, workshops and mentorship.',
    'Develop teamwork, leadership, entrepreneurship and professional competencies.',
    'Represent the university in national and international technical competitions and innovation platforms.',
  ];

  return (
    <div className="space-y-16">
      {/* 1. Main About Hero – Large Image-Based Futuristic Section */}
      <section className="relative rounded-[22px] overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.8)] group bg-[#07090e]">
        {/* Layer 1: Futuristic Background Image (AI humanoid robot interacting with neural interfaces) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/brand/ai_robot.jpg"
            alt="Futuristic AI Humanoid Robot and Holographic Code Interfaces"
            className="w-full h-full object-cover object-right md:object-[75%_center] scale-100 group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
          />
        </div>

        {/* Layer 2: Multi-layer Dark Gradient Overlays (70-85% Opacity on Text Side, natural fade into image) */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#060913] via-[#060913]/90 via-45% md:via-55% to-[#060913]/35" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#060913] via-transparent to-[#060913]/60" />

        {/* Layer 3: Ambient Radial Cyan and Purple Glow Blooms */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none z-[2]" />
        <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none z-[2]" />
        <div className="absolute top-1/2 right-12 w-64 h-64 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none z-[2]" />

        {/* Layer 4: Content Overlay on the Left */}
        <div className="relative z-10 p-8 sm:p-12 md:p-16 max-w-2xl lg:max-w-3xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-950/60 text-cyan-300 border border-cyan-500/40 mb-6 shadow-[0_0_20px_rgba(0,242,254,0.25)] backdrop-blur-md">
            <Sparkles size={13} className="text-cyan-400 animate-pulse" />
            <span>SCOPE GLOBAL SKILLS UNIVERSITY</span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal bg-[#060913]/50 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-inner">
            Binary Battle Club is the official student-led innovation and coding ecosystem at Scope Global Skills University (SGSU), Bhopal. Based within the School of Future Skills and Information Technology, our community brings together eager novices, competitive programmers, and full-stack builders who collaborate to bridge theory and real-world engineering.
          </p>
        </div>
      </section>

      {/* 2. Vision and Mission – Image Overlay Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Our Vision Card */}
        <div className="relative rounded-[22px] overflow-hidden border border-cyan-500/40 hover:border-cyan-400 transition-all duration-500 shadow-[0_0_35px_rgba(0,242,254,0.12)] hover:shadow-[0_0_50px_rgba(0,242,254,0.25)] flex flex-col justify-between group bg-[#07090e]">
          {/* Card Background Image: Futuristic Digital Network & Connected Neural Nodes */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80"
              alt="Digital Network and Futuristic Technological Ecosystem"
              className="w-full h-full object-cover scale-100 group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            />
          </div>

          {/* Dark Navy Multi-Layer Gradient Overlays */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#060913] via-[#060913]/90 to-[#070f24]/80" />
          <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#060913]/95 via-[#060913]/85 to-cyan-950/40" />

          {/* Radial Cyan Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none z-[2]" />

          {/* Card Content Overlay */}
          <div className="relative z-10 p-8 sm:p-10 flex flex-col h-full justify-between">
            <div>
              {/* Header Icon + Label */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-13 h-13 p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 flex items-center justify-center shadow-[0_0_20px_rgba(0,242,254,0.2)]">
                  <Eye size={24} />
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                  FUTURE_DIRECTION
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-4">
                Our Vision
              </h2>

              {/* Complete Vision Quote Preserved Verbatim */}
              <blockquote className="p-5 rounded-2xl bg-[#060913]/80 backdrop-blur-md border-l-4 border-cyan-400 border-y border-r border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed font-normal shadow-lg">
                "To build a vibrant, inclusive and innovation-driven technology community that empowers students to become skilled programmers, creative problem-solvers and future-ready technology leaders who create meaningful impact through code and innovation."
              </blockquote>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-cyan-400/80">SGSU // STUDENT AGENCY</span>
              <span>INNOVATION ECOSYSTEM</span>
            </div>
          </div>
        </div>

        {/* Our Mission Card */}
        <div className="relative rounded-[22px] overflow-hidden border border-purple-500/40 hover:border-purple-400 transition-all duration-500 shadow-[0_0_35px_rgba(168,85,247,0.12)] hover:shadow-[0_0_50px_rgba(168,85,247,0.25)] flex flex-col justify-between group bg-[#07090e]">
          {/* Card Background Image: Futuristic AI Workspace & Coding Multi-Screens */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80"
              alt="Programmer working on futuristic code interfaces"
              className="w-full h-full object-cover scale-100 group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            />
          </div>

          {/* Dark Purple Multi-Layer Gradient Overlays */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#060913] via-[#060913]/92 to-[#170a2c]/80" />
          <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#060913]/95 via-[#060913]/85 to-purple-950/40" />

          {/* Radial Purple Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none z-[2]" />

          {/* Card Content Overlay */}
          <div className="relative z-10 p-8 sm:p-10 flex flex-col h-full justify-between">
            <div>
              {/* Header Icon + Label */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-13 h-13 p-3 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-300 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                  <Target size={24} />
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                  CORE_MISSION
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3">
                Our Mission
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5 italic">
                "To nurture a culture of coding, collaboration, creativity and continuous learning by providing students with opportunities to:"
              </p>

              {/* Complete 7 Mission Points Preserved Verbatim */}
              <ul className="space-y-3 bg-[#060913]/80 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-lg">
                {missionPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200 leading-snug">
                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="text-purple-400/80">7 ACTION PILLARS</span>
              <span>CONTINUOUS LEARNING</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. What We Stand For: Sleek Minimal Squircle Row */}
      <section>
        <SectionHeading
          badge="Guiding Values"
          title="What We Stand For"
          subtitle="Our core pillars that steer every workshop, competition, and student project across Scope Global Skills University."
        />

        <div className="bg-white/10 p-px rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.7)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-[#03060c] hover:bg-[#070b16] transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between group min-h-[220px]"
              >
                {/* Top Squircle App-Like Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ring-1 ring-white/15 transition-all duration-300 group-hover:scale-105 ${pillar.squircle} ${pillar.glow}`}
                >
                  <Icon size={26} className={`${pillar.iconColor} drop-shadow`} />
                </div>

                {/* Bottom Text Content */}
                <div className="mt-8">
                  <span className={`text-xs sm:text-sm font-medium ${pillar.labelColor} block mb-1.5`}>
                    {pillar.label}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-white transition-colors flex items-center gap-1.5 leading-snug">
                    <span>{pillar.action}</span>
                    <span
                      className={`text-slate-500 ${pillar.arrowHover} group-hover:translate-x-1.5 transition-all shrink-0 inline-block`}
                    >
                      →
                    </span>
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

