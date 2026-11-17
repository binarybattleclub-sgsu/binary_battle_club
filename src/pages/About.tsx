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
    },
    {
      label: '02. Learn & Upskill',
      action: 'Train. Practice. Develop skills.',
      icon: GraduationCap,
    },
    {
      label: '03. Create & Showcase',
      action: 'Build projects. Demonstrate innovation.',
      icon: Rocket,
    },
    {
      label: '04. Events & Achievements',
      action: 'Participate. Compete. Get recognised.',
      icon: Trophy,
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
    <div className="space-y-16 text-[#DCE6F5]">
      {/* 1. Main About Hero – Image-Based Section */}
      <section className="relative rounded-[22px] overflow-hidden border border-[#243650] shadow-[0_20px_60px_rgba(8,13,24,0.9)] group bg-[#101D35]">
        {/* Layer 1: Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/brand/ai_robot.jpg"
            alt="Futuristic AI Humanoid Robot and Holographic Code Interfaces"
            className="w-full h-full object-cover object-right md:object-[75%_center] scale-100 group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
          />
        </div>

        {/* Layer 2: Midnight Black Gradient Overlays */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#080D18] via-[#080D18]/92 via-50% to-[#080D18]/40" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#080D18] via-transparent to-[#080D18]/60" />

        {/* Layer 3: Ambient Blue & Cyan Blooms */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#2563EB]/15 rounded-full blur-3xl pointer-events-none z-[2]" />
        <div className="absolute -bottom-24 right-1/4 w-96 h-96 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none z-[2]" />

        {/* Layer 4: Content Overlay */}
        <div className="relative z-10 p-8 sm:p-12 md:p-16 max-w-2xl lg:max-w-3xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-[#2563EB]/15 text-[#38BDF8] border border-[#2563EB]/30 mb-6 shadow-[0_0_15px_rgba(37,99,235,0.2)] backdrop-blur-md">
            <Sparkles size={13} className="text-[#38BDF8] animate-pulse" />
            <span>SCOPE GLOBAL SKILLS UNIVERSITY</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#DCE6F5] tracking-tight mb-4">
            Engineering the Future of Student Technology
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#DCE6F5] leading-relaxed font-normal bg-[#080D18]/75 backdrop-blur-md p-5 rounded-2xl border border-[#243650] shadow-inner">
            Binary Battle Club is the official student-led innovation and coding ecosystem at Scope Global Skills University (SGSU), Bhopal. Based within the School of Future Skills and Information Technology, our community brings together eager novices, competitive programmers, and full-stack builders who collaborate to bridge theory and real-world engineering.
          </p>
        </div>
      </section>

      {/* 2. Vision and Mission – Image Overlay Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Our Vision Card */}
        <div className="relative rounded-[22px] overflow-hidden border border-[#243650] hover:border-[#38BDF8]/50 transition-all duration-500 shadow-[0_12px_35px_rgba(8,13,24,0.8),0_0_20px_rgba(37,99,235,0.15)] flex flex-col justify-between group bg-[#101D35]">
          {/* Card Background Image */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80"
              alt="Digital Network and Futuristic Technological Ecosystem"
              className="w-full h-full object-cover scale-100 group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            />
          </div>

          {/* Dark Navy Gradient Overlays */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#080D18] via-[#080D18]/92 to-[#101D35]/80" />
          <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#080D18]/95 via-[#080D18]/85 to-transparent" />

          {/* Card Content Overlay */}
          <div className="relative z-10 p-8 sm:p-10 flex flex-col h-full justify-between">
            <div>
              {/* Header Icon + Label */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 p-2.5 rounded-2xl bg-[#2563EB]/15 border border-[#2563EB]/30 text-[#38BDF8] flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                  <Eye size={22} />
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8] px-3 py-1 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/25">
                  FUTURE_DIRECTION
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#DCE6F5] tracking-tight mb-4">
                Our Vision
              </h2>

              <blockquote className="p-5 rounded-2xl bg-[#080D18]/85 backdrop-blur-md border-l-4 border-[#38BDF8] border-y border-r border-[#243650] text-xs sm:text-sm text-[#DCE6F5] leading-relaxed font-normal shadow-lg">
                &ldquo;To build a vibrant, inclusive and innovation-driven technology community that empowers students to become skilled programmers, creative problem-solvers and future-ready technology leaders who create meaningful impact through code and innovation.&rdquo;
              </blockquote>
            </div>

            <div className="mt-8 pt-4 border-t border-[#243650] flex items-center justify-between text-xs font-mono text-[#9FB0C8]">
              <span className="text-[#38BDF8]">SGSU // STUDENT AGENCY</span>
              <span>INNOVATION ECOSYSTEM</span>
            </div>
          </div>
        </div>

        {/* Our Mission Card */}
        <div className="relative rounded-[22px] overflow-hidden border border-[#243650] hover:border-[#38BDF8]/50 transition-all duration-500 shadow-[0_12px_35px_rgba(8,13,24,0.8),0_0_20px_rgba(37,99,235,0.15)] flex flex-col justify-between group bg-[#101D35]">
          {/* Card Background Image */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80"
              alt="Programmer working on futuristic code interfaces"
              className="w-full h-full object-cover scale-100 group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            />
          </div>

          {/* Dark Navy Gradient Overlays */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#080D18] via-[#080D18]/92 to-[#101D35]/80" />
          <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#080D18]/95 via-[#080D18]/85 to-transparent" />

          {/* Card Content Overlay */}
          <div className="relative z-10 p-8 sm:p-10 flex flex-col h-full justify-between">
            <div>
              {/* Header Icon + Label */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 p-2.5 rounded-2xl bg-[#2563EB]/15 border border-[#2563EB]/30 text-[#38BDF8] flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                  <Target size={22} />
                </div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8] px-3 py-1 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/25">
                  CORE_MISSION
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-[#DCE6F5] tracking-tight mb-3">
                Our Mission
              </h2>

              <p className="text-xs sm:text-sm text-[#9FB0C8] leading-relaxed mb-5 italic">
                &ldquo;To nurture a culture of coding, collaboration, creativity and continuous learning by providing students with opportunities to:&rdquo;
              </p>

              {/* 7 Mission Points */}
              <ul className="space-y-2.5 bg-[#080D18]/85 backdrop-blur-md p-5 rounded-2xl border border-[#243650] shadow-lg">
                {missionPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#DCE6F5] leading-snug">
                    <CheckCircle2 size={16} className="text-[#38BDF8] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-[#243650] flex items-center justify-between text-xs font-mono text-[#9FB0C8]">
              <span className="text-[#38BDF8]">7 ACTION PILLARS</span>
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

        <div className="bg-[#243650] p-px rounded-3xl overflow-hidden border border-[#243650] shadow-[0_20px_50px_rgba(8,13,24,0.9)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-[#101D35] hover:bg-[#172945] transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between group min-h-[220px]"
              >
                {/* Top Squircle Icon */}
                <div className="w-13 h-13 rounded-2xl flex items-center justify-center bg-[#080D18] border border-[#243650] group-hover:border-[#38BDF8]/50 shadow-[0_4px_15px_rgba(8,13,24,0.8)] transition-all duration-300 group-hover:scale-105 p-3">
                  <Icon size={24} className="text-[#38BDF8]" />
                </div>

                {/* Bottom Text Content */}
                <div className="mt-8">
                  <span className="text-xs sm:text-sm font-mono font-medium text-[#38BDF8] block mb-1.5">
                    {pillar.label}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-[#DCE6F5] transition-colors flex items-center gap-1.5 leading-snug">
                    <span>{pillar.action}</span>
                    <span className="text-[#9FB0C8] group-hover:text-[#38BDF8] group-hover:translate-x-1.5 transition-all shrink-0 inline-block">
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
