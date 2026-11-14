import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ArrowRight,
  Cpu,
  GraduationCap,
  Rocket,
  Trophy,
  Sparkles,
  Flame,
  CheckCircle2,
  Calendar,
  Layers,
  Terminal,
} from 'lucide-react';
import { ASSETS } from '../data/assets';
import { MarqueeTicker } from '../components/MarqueeTicker';

export const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'internal' | 'national'>('all');

  const pillars = [
    {
      id: '01',
      title: 'Explore & Share',
      path: '/explore-technologies',
      icon: Cpu,
      image: ASSETS.workshops.rntu1,
      description: 'Discover cutting-edge technologies. Share tutorials, architectural guides, and engineering knowledge across the university.',
    },
    {
      id: '02',
      title: 'Learn & Upskill',
      path: '/code-compete',
      icon: GraduationCap,
      image: ASSETS.workshops.fridayCollage,
      description: 'Train through hands-on bootcamps. Practice algorithms, competitive coding, and develop real-world problem-solving skills.',
    },
    {
      id: '03',
      title: 'Create & Showcase',
      path: '/innovate-build',
      icon: Rocket,
      image: ASSETS.workshops.outreach1,
      description: 'Build real-world software & hardware projects. Demonstrate student innovation at university exhibitions and demo days.',
    },
    {
      id: '04',
      title: 'Events & Achievements',
      path: '/hackathons',
      icon: Trophy,
      image: ASSETS.hackathons.sgsu2,
      description: 'Participate in intensive 12h & 24h hackathons. Compete at state and national championship stages and get recognised.',
    },
  ];

  const caseStudies = [
    {
      id: 1,
      category: 'internal',
      title: '12-Hour SGSU Internal Hackathon',
      subtitle: '60+ participants across 15 student teams ideating, architecting, and defending working software prototypes under a tight 12-hour sprint at SGSU Bhopal.',
      badge: '12 Hours Non-Stop',
      path: '/hackathons',
    },
    {
      id: 2,
      category: 'national',
      title: '24-Hour Navonamesh State Hackathon',
      subtitle: 'High-energy 24-hour overnight hackathon featuring inter-collegiate competitive participation, solving real-world domain challenges under time pressure.',
      badge: '24-Hour Overnight',
      path: '/hackathons',
    },
    {
      id: 3,
      category: 'national',
      title: '36th National WorkSkills Championship',
      subtitle: 'Student champions representing SGSU Bhopal across national technical competitions, earning prestigious accolades in cloud, web, and AI skills.',
      badge: 'National Accolade',
      path: '/achievements',
    },
  ];

  const filteredCaseStudies = activeTab === 'all'
    ? caseStudies
    : caseStudies.filter((item) => item.category === activeTab);

  const recentUpdates = [
    {
      title: 'Friday Hands-on Innovation Lab',
      date: 'Weekly Friday Sessions',
      author: 'SGSU Tech Squad',
      image: ASSETS.workshops.friday1,
      tag: 'Hands-on Lab',
      description: 'Practical coding exercises, API integrations, and code reviews directly guided by senior students and faculty mentors.',
      link: '/code-compete',
    },
    {
      title: 'RNTU Training & Outreach Sprint',
      date: 'Inter-University Sprint',
      author: 'Binary Battle Team',
      image: ASSETS.workshops.rntu2,
      tag: 'Outreach Sprint',
      description: 'Collaborative development workshop and peer technical training exchange conducted with regional technical universities.',
      link: '/explore-technologies',
    },
    {
      title: 'BGI Hackathon Victory & Accolades',
      date: 'Collegiate Championship',
      author: 'Competitive Coding Wing',
      image: ASSETS.achievements.bgi1,
      tag: 'Championship Win',
      description: '1st place victory and best technical innovation award secured by club representatives at regional inter-college hackathon.',
      link: '/achievements',
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24 text-slate-200">
      {/* SECTION 1: HERO - Dual Asymmetric Layout matching reference image */}
      <section className="relative pt-2 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Asymmetric Monochrome Photography Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Top Image */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] aspect-[4/3] sm:aspect-[14/10] bg-[#0c0d14]">
                <img
                  src={ASSETS.hackathons.sgsu1}
                  alt="Students coding together at SGSU Hackathon"
                  className="w-full h-full object-cover grayscale contrast-125 brightness-95 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-medium tracking-wider text-slate-300">
                  SGSU HACKATHON ARENA
                </div>
              </div>

              {/* Overlapping Secondary Image (Offset Bottom Right) */}
              <div className="absolute -bottom-6 -right-3 sm:-bottom-8 sm:-right-6 w-3/5 rounded-2xl overflow-hidden border-2 border-[#05060A] shadow-[0_25px_60px_rgba(0,0,0,0.9)] aspect-[4/3] bg-[#0a0b12] hidden sm:block">
                <img
                  src={ASSETS.workshops.friday1}
                  alt="Student workshop session"
                  className="w-full h-full object-cover grayscale contrast-125 brightness-90 hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Floating Crimson Target Badge (Matching reference design circle badge) */}
              <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FF1E56] text-white flex items-center justify-center shadow-[0_0_25px_rgba(255,30,86,0.5)] border-2 border-[#05060A] z-20 animate-pulse">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/50 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF1E56]" />
                  </div>
                </div>
              </div>

              {/* Subtle tech coordinates tag */}
              <div className="absolute -bottom-3 left-4 px-3 py-1 rounded-md bg-[#05060A] border border-white/10 text-[10px] font-mono tracking-widest text-slate-400">
                LAT 23.2599° N • LON 77.4126° E
              </div>
            </div>
          </div>

          {/* Right Column: Hero Content & Crimson CTAs */}
          <div className="lg:col-span-6 space-y-6">
            {/* Crimson Quote Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#FF1E56]/10 text-[#FF1E56] border border-[#FF1E56]/30">
              <span className="text-[#FF1E56] font-bold">“</span>
              <span>SCOPE GLOBAL SKILLS UNIVERSITY</span>
              <span className="text-[#FF1E56] font-bold">”</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-white tracking-tight leading-[1.12]">
              A Club by the Students, for the Students.
            </h1>

            {/* Subtext Paragraph */}
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
              Where coding meets creativity, ideas turn into innovation, and learning goes beyond the classroom. Scope Global Skills University&apos;s premier hub for hands-on software development, competitive programming, and technical excellence.
            </p>

            {/* Two Side-by-Side Feature Highlights (Matching reference image) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/15 transition-all">
                <div className="flex items-center gap-2.5 text-white font-semibold text-sm mb-1.5">
                  <div className="w-6 h-6 rounded-lg bg-rose-500/10 text-[#FF1E56] flex items-center justify-center">
                    <Sparkles size={14} />
                  </div>
                  <span>Student-Led Innovation</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Peer-driven workshops, software projects, and collaborative engineering.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/15 transition-all">
                <div className="flex items-center gap-2.5 text-white font-semibold text-sm mb-1.5">
                  <div className="w-6 h-6 rounded-lg bg-rose-500/10 text-[#FF1E56] flex items-center justify-center">
                    <Trophy size={14} />
                  </div>
                  <span>Competitive Mastery</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Internal hackathon sprints and national representations for SGSU Bhopal.
                </p>
              </div>
            </div>

            {/* Crimson Capsule CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/explore-technologies"
                className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-[#FF1E56] hover:bg-[#e01648] text-white font-semibold text-sm shadow-[0_10px_25px_rgba(255,30,86,0.35)] hover:shadow-[0_12px_30px_rgba(255,30,86,0.5)] transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Explore & Share</span>
                <ArrowUpRight size={16} />
              </Link>

              <Link
                to="/join-community"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 hover:border-white/40 text-slate-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] text-sm font-medium transition-all"
              >
                <span>Join the Community</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: GIANT TYPOGRAPHIC AGENCY DIVIDER (Recreating "WEB DESIGN AGENCY" from reference) */}
      <section className="relative overflow-hidden py-6 border-y border-white/[0.08] bg-[#07080D]/60 select-none">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight uppercase flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]">
              BINARY
            </span>
            <span className="text-stroke tracking-normal">
              BATTLE
            </span>
            <span className="text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]">
              CLUB
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#FF1E56] uppercase">
            <span>// SGSU BHOPAL</span>
            <span className="w-2 h-2 rounded-full bg-[#FF1E56] animate-ping" />
          </div>
        </div>
      </section>

      {/* SECTION 3: SERVICES BUILT SPECIFICALLY - Horizontal Interactive Strips */}
      <section className="space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#FF1E56]/10 text-[#FF1E56] border border-[#FF1E56]/30">
              <span>“ WHAT WE STAND FOR ”</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Services Built Specifically for Students
            </h2>
          </div>

          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF1E56] hover:bg-[#e01648] text-white font-semibold text-xs tracking-wide shadow-[0_8px_20px_rgba(255,30,86,0.3)] transition-all self-start sm:self-auto"
          >
            <span>Learn More</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Horizontal Service Strips */}
        <div className="border-t border-white/[0.08] divide-y divide-white/[0.08]">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Link
                key={pillar.id}
                to={pillar.path}
                className="group py-6 sm:py-8 px-2 sm:px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-white/[0.02] transition-colors rounded-xl"
              >
                {/* Left: Icon & Title */}
                <div className="flex items-center gap-4 sm:gap-6 min-w-[240px] lg:min-w-[280px]">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 group-hover:border-[#FF1E56]/50 group-hover:bg-[#FF1E56]/10 text-slate-300 group-hover:text-[#FF1E56] flex items-center justify-center transition-all">
                    <Icon size={20} />
                  </div>
                  <div>
                    <span className="text-base sm:text-lg font-bold text-white group-hover:text-rose-400 transition-colors flex items-center gap-2">
                      <span className="text-slate-500 font-mono text-xs">{pillar.id}.</span>
                      {pillar.title}
                    </span>
                  </div>
                </div>

                {/* Center: Pill-shaped Image Preview (Matching reference screenshot exactly) */}
                <div className="hidden md:block shrink-0">
                  <div className="w-48 lg:w-64 h-14 rounded-full overflow-hidden border border-white/20 shadow-md grayscale group-hover:grayscale-0 group-hover:scale-105 group-hover:border-rose-500/50 transition-all duration-300">
                    <img
                      src={pillar.image}
                      alt={pillar.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Right: Description & Arrow */}
                <div className="flex items-center justify-between gap-6 flex-1 max-w-xl">
                  <p className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 transition-colors line-clamp-2">
                    {pillar.description}
                  </p>
                  <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 group-hover:bg-[#FF1E56] group-hover:text-white flex items-center justify-center shrink-0 transition-all">
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: REFERENCES OR CASE STUDY - Connected Timeline Section */}
      <section className="space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#FF1E56]/10 text-[#FF1E56] border border-[#FF1E56]/30">
              <span>“ CASE STUDY & SPRINTS ”</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              References or Case Study
            </h2>
          </div>

          {/* Filter Pills (Matching reference image tab buttons: All, Design & Dev, Motion & Option) */}
          <div className="inline-flex p-1 rounded-lg bg-white/[0.04] border border-white/10 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('internal')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'internal'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Internal Sprints
            </button>
            <button
              onClick={() => setActiveTab('national')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'national'
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              State & National
            </button>
          </div>
        </div>

        {/* Layout: Tall Monochrome Photo on Left, Connected Timeline on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Tall B&W Image */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 aspect-[4/5] bg-[#0c0d14] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              <img
                src={ASSETS.hackathons.sgsu2}
                alt="Hackathon team ideation"
                className="w-full h-full object-cover grayscale contrast-125 brightness-95 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                <div className="text-xs font-bold text-white">SGSU Innovation Lab</div>
                <div className="text-[11px] text-slate-300 mt-0.5">Where collegiate ideas transform into scalable software solutions.</div>
              </div>
            </div>
          </div>

          {/* Right Column: Connected Numbered Timeline */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative pl-8 sm:pl-10 space-y-8 before:absolute before:left-3.5 sm:before:left-4 before:top-3 before:bottom-3 before:w-[1.5px] before:bg-white/15">
              {filteredCaseStudies.map((item) => (
                <div key={item.id} className="relative group">
                  {/* Crimson Numbered Circle Badge */}
                  <div className="absolute -left-8 sm:-left-10 top-0.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FF1E56] text-white font-bold text-xs sm:text-sm flex items-center justify-center shadow-[0_0_15px_rgba(255,30,86,0.5)] border-2 border-[#05060A] ring-1 ring-white/20">
                    {item.id}
                  </div>

                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 hover:bg-white/[0.04] transition-all">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-rose-400 transition-colors">
                        {item.title}
                      </h3>
                      <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
                        {item.badge}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {item.subtitle}
                    </p>

                    <div className="mt-3">
                      <Link
                        to={item.path}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                      >
                        <span>View Details</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: RECENT UPDATES & BLOGS - Matching Bottom of Reference */}
      <section className="space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#FF1E56]/10 text-[#FF1E56] border border-[#FF1E56]/30">
              <span>“ RECENT ACTIVITIES ”</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Recent Activities & Workshops
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Stay up-to-date with the latest tech sessions, weekend labs, and competition victories across our student community.
            </p>
          </div>

          <Link
            to="/hackathons"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#FF1E56] hover:bg-[#e01648] text-white font-semibold text-xs tracking-wide shadow-[0_8px_20px_rgba(255,30,86,0.3)] transition-all self-start sm:self-auto"
          >
            <span>View All Events</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* 3 Dark Agency Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentUpdates.map((update, idx) => (
            <div
              key={idx}
              className="group rounded-2xl overflow-hidden bg-white/[0.02] border border-white/[0.07] hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0c0d14]">
                  <img
                    src={update.image}
                    alt={update.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-semibold text-rose-300">
                    {update.tag}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>{update.date}</span>
                    <span>{update.author}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-rose-400 transition-colors leading-snug">
                    {update.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {update.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="p-5 pt-0">
                <Link
                  to={update.link}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF1E56] hover:bg-[#e01648] text-white font-medium text-xs shadow-md transition-all"
                >
                  <span>Explore Session</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Marquee Ticker Tape */}
      <div className="pt-4">
        <MarqueeTicker />
      </div>
    </div>
  );
};
