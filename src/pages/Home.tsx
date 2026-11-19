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
import { HeroSlideshow } from '../components/HeroSlideshow';

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
      imagePosition: 'center 20%',
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
    <div className="space-y-16 lg:space-y-24 text-[#DCE6F5]">
      {/* SECTION 1: HERO - Dual Asymmetric Layout */}
      <section className="relative pt-2 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Hero Community Slideshow & Masterclass Promotion */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-md lg:max-w-none space-y-3 sm:space-y-4">
              <HeroSlideshow />

              {/* Gemini AI Masterclass Promotional Card (Preserved without obscuring faces) */}
              <div className="relative rounded-2xl overflow-hidden bg-[#101D35]/90 border border-[#243650] hover:border-[#38BDF8]/40 shadow-lg p-2.5 sm:p-3 flex items-center justify-between gap-2.5 sm:gap-3 group transition-all">
                <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-[#243650] bg-[#080D18] shrink-0 relative">
                    <img
                      src={ASSETS.workshops.friday1}
                      alt="Gemini AI Masterclass"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080D18]/60 to-transparent pointer-events-none" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-[#2563EB]/15 text-[#38BDF8] border border-[#2563EB]/30 truncate">
                        Weekly Masterclass
                      </span>
                      <span className="text-[10px] font-mono text-[#9FB0C8] hidden sm:inline">
                        SGSU Tech Squad
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#DCE6F5] truncate group-hover:text-[#38BDF8] transition-colors">
                      Gemini AI Masterclass & Lab
                    </h4>
                    <p className="text-[10px] sm:text-[11px] text-[#9FB0C8] line-clamp-1 mt-0.5">
                      Every Friday: AI prompt engineering & hands-on prototypes.
                    </p>
                  </div>
                </div>

                <Link
                  to="/code-compete"
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#2563EB]/15 hover:bg-[#2563EB] text-[#38BDF8] hover:text-white border border-[#2563EB]/30 text-[11px] sm:text-xs font-mono font-semibold transition-all shrink-0 flex items-center gap-1 shadow-sm"
                >
                  <span>View</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Content & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            {/* University Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-[#2563EB]/10 text-[#38BDF8] border border-[#2563EB]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
              <span>SCOPE GLOBAL SKILLS UNIVERSITY</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#DCE6F5] tracking-tight leading-[1.12]">
              A Club by the Students, for the Students.
            </h1>

            {/* Subtext Paragraph */}
            <p className="text-sm sm:text-base text-[#9FB0C8] leading-relaxed font-normal">
              Where coding meets creativity, ideas turn into innovation, and learning goes beyond the classroom. Scope Global Skills University&apos;s premier hub for hands-on software development, competitive programming, and technical excellence.
            </p>

            {/* Two Side-by-Side Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-xl bg-[#101D35]/80 border border-[#243650] hover:border-[#38BDF8]/40 hover:bg-[#172945]/80 transition-all">
                <div className="flex items-center gap-2.5 text-[#DCE6F5] font-semibold text-sm mb-1.5">
                  <div className="w-6 h-6 rounded-lg bg-[#2563EB]/15 text-[#38BDF8] flex items-center justify-center border border-[#2563EB]/30">
                    <Sparkles size={14} />
                  </div>
                  <span>Student-Led Innovation</span>
                </div>
                <p className="text-xs text-[#9FB0C8] leading-relaxed">
                  Peer-driven workshops, software projects, and collaborative engineering.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#101D35]/80 border border-[#243650] hover:border-[#38BDF8]/40 hover:bg-[#172945]/80 transition-all">
                <div className="flex items-center gap-2.5 text-[#DCE6F5] font-semibold text-sm mb-1.5">
                  <div className="w-6 h-6 rounded-lg bg-[#2563EB]/15 text-[#38BDF8] flex items-center justify-center border border-[#2563EB]/30">
                    <Trophy size={14} />
                  </div>
                  <span>Competitive Mastery</span>
                </div>
                <p className="text-xs text-[#9FB0C8] leading-relaxed">
                  Internal hackathon sprints and national representations for SGSU Bhopal.
                </p>
              </div>
            </div>

            {/* Primary & Secondary CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/explore-technologies"
                className="btn-primary"
              >
                <span>Explore & Share</span>
                <ArrowUpRight size={16} />
              </Link>

              <Link
                to="/join-community"
                className="btn-secondary"
              >
                <span>Join the Community</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: GIANT TYPOGRAPHIC AGENCY DIVIDER */}
      <section className="relative overflow-hidden py-6 border-y border-[#243650] bg-[#101D35]/40 select-none">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-4">
          <div className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight uppercase flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-[#DCE6F5] drop-shadow-[0_2px_10px_rgba(220,230,245,0.12)]">
              BINARY
            </span>
            <span className="text-stroke tracking-normal">
              BATTLE
            </span>
            <span className="text-[#DCE6F5] drop-shadow-[0_2px_10px_rgba(220,230,245,0.12)]">
              CLUB
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#38BDF8] uppercase font-mono">
            <span>// SGSU BHOPAL</span>
            <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse" />
          </div>
        </div>
      </section>

      {/* SECTION 3: SERVICES BUILT SPECIFICALLY - Horizontal Interactive Strips */}
      <section className="space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-[#2563EB]/10 text-[#38BDF8] border border-[#2563EB]/30">
              <span>“ WHAT WE STAND FOR ”</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#DCE6F5] tracking-tight">
              Services Built Specifically for Students
            </h2>
          </div>

          <Link
            to="/about"
            className="btn-secondary self-start sm:self-auto"
          >
            <span>Learn More</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Horizontal Service Strips */}
        <div className="border-t border-[#243650] divide-y divide-[#243650]">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Link
                key={pillar.id}
                to={pillar.path}
                className="group py-6 sm:py-8 px-2 sm:px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-[#101D35]/50 transition-colors rounded-xl"
              >
                {/* Left: Icon & Title */}
                <div className="flex items-center gap-4 sm:gap-6 min-w-[240px] lg:min-w-[280px]">
                  <div className="w-10 h-10 rounded-xl bg-[#101D35] border border-[#243650] group-hover:border-[#38BDF8]/50 group-hover:bg-[#2563EB]/15 text-[#9FB0C8] group-hover:text-[#38BDF8] flex items-center justify-center transition-all">
                    <Icon size={20} />
                  </div>
                  <div>
                    <span className="text-base sm:text-lg font-bold text-[#DCE6F5] group-hover:text-[#38BDF8] transition-colors flex items-center gap-2">
                      <span className="text-[#9FB0C8]/60 font-mono text-xs">{pillar.id}.</span>
                      {pillar.title}
                    </span>
                  </div>
                </div>

                {/* Center: Pill-shaped Image Preview */}
                <div className="hidden md:block shrink-0">
                  <div className="w-48 lg:w-64 h-14 rounded-full overflow-hidden border border-[#243650] shadow-md group-hover:scale-105 group-hover:border-[#38BDF8]/50 transition-all duration-300">
                    <img
                      src={pillar.image}
                      alt={pillar.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Right: Description & Arrow */}
                <div className="flex items-center justify-between gap-6 flex-1 max-w-xl">
                  <p className="text-xs sm:text-sm text-[#9FB0C8] group-hover:text-[#DCE6F5] transition-colors line-clamp-2">
                    {pillar.description}
                  </p>
                  <div className="w-8 h-8 rounded-full bg-[#101D35] border border-[#243650] group-hover:bg-[#2563EB] group-hover:border-[#2563EB] group-hover:text-[#DCE6F5] text-[#9FB0C8] flex items-center justify-center shrink-0 transition-all shadow-sm">
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
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-[#2563EB]/10 text-[#38BDF8] border border-[#2563EB]/30">
              <span>“ CASE STUDY & SPRINTS ”</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#DCE6F5] tracking-tight">
              References or Case Study
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="inline-flex p-1 rounded-lg bg-[#101D35] border border-[#243650] self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold font-mono transition-all ${
                activeTab === 'all'
                  ? 'bg-[#2563EB] text-[#DCE6F5] shadow-sm'
                  : 'text-[#9FB0C8] hover:text-[#DCE6F5]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('internal')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold font-mono transition-all ${
                activeTab === 'internal'
                  ? 'bg-[#2563EB] text-[#DCE6F5] shadow-sm'
                  : 'text-[#9FB0C8] hover:text-[#DCE6F5]'
              }`}
            >
              Internal Sprints
            </button>
            <button
              onClick={() => setActiveTab('national')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold font-mono transition-all ${
                activeTab === 'national'
                  ? 'bg-[#2563EB] text-[#DCE6F5] shadow-sm'
                  : 'text-[#9FB0C8] hover:text-[#DCE6F5]'
              }`}
            >
              State & National
            </button>
          </div>
        </div>

        {/* Layout: Tall Photo on Left, Connected Timeline on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Tall Image */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#243650] aspect-[4/5] bg-[#101D35] shadow-[0_20px_50px_rgba(8,13,24,0.8)]">
              <img
                src={ASSETS.hackathons.sgsu2}
                alt="Hackathon team ideation"
                className="w-full h-full object-cover contrast-110 brightness-95 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080D18]/90 via-[#080D18]/30 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#080D18]/80 backdrop-blur-md border border-[#243650]">
                <div className="text-xs font-bold text-[#DCE6F5]">SGSU Innovation Lab</div>
                <div className="text-[11px] text-[#9FB0C8] mt-0.5">Where collegiate ideas transform into scalable software solutions.</div>
              </div>
            </div>
          </div>

          {/* Right Column: Connected Numbered Timeline */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative pl-8 sm:pl-10 space-y-8 before:absolute before:left-3.5 sm:before:left-4 before:top-3 before:bottom-3 before:w-[1.5px] before:bg-[#243650]">
              {filteredCaseStudies.map((item) => (
                <div key={item.id} className="relative group">
                  {/* Numbered Circle Badge */}
                  <div className="absolute -left-8 sm:-left-10 top-0.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#2563EB] text-[#DCE6F5] font-bold text-xs sm:text-sm flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)] border-2 border-[#080D18] ring-1 ring-[#38BDF8]/40">
                    {item.id}
                  </div>

                  <div className="p-5 rounded-2xl bg-[#101D35]/80 border border-[#243650] hover:border-[#38BDF8]/40 hover:bg-[#172945] transition-all">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <h3 className="text-base sm:text-lg font-bold text-[#DCE6F5] group-hover:text-[#38BDF8] transition-colors">
                        {item.title}
                      </h3>
                      <span className="text-[10px] font-mono font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#2563EB]/15 text-[#38BDF8] border border-[#2563EB]/30">
                        {item.badge}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#9FB0C8] leading-relaxed">
                      {item.subtitle}
                    </p>

                    <div className="mt-3">
                      <Link
                        to={item.path}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#38BDF8] hover:text-[#7dd3fc] transition-colors"
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

      {/* SECTION 5: RECENT UPDATES & BLOGS */}
      <section className="space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-[#2563EB]/10 text-[#38BDF8] border border-[#2563EB]/30">
              <span>“ RECENT ACTIVITIES ”</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#DCE6F5] tracking-tight">
              Recent Activities & Workshops
            </h2>
            <p className="text-xs sm:text-sm text-[#9FB0C8] max-w-xl">
              Stay up-to-date with the latest tech sessions, weekend labs, and competition victories across our student community.
            </p>
          </div>

          <Link
            to="/hackathons"
            className="btn-secondary self-start sm:self-auto"
          >
            <span>View All Events</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* 3 Dark Technology Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentUpdates.map((update, idx) => (
            <div
              key={idx}
              className="group rounded-2xl overflow-hidden bg-[#101D35]/80 border border-[#243650] hover:border-[#38BDF8]/40 hover:bg-[#172945] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#080D18]">
                  <img
                    src={update.image}
                    alt={update.title}
                    style={update.imagePosition ? { objectPosition: update.imagePosition } : undefined}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#080D18]/80 backdrop-blur-md border border-[#243650] text-[10px] font-mono font-semibold text-[#38BDF8]">
                    {update.tag}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-[#9FB0C8] font-mono">
                    <span>{update.date}</span>
                    <span className="text-[#38BDF8]/80">{update.author}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-[#DCE6F5] group-hover:text-[#38BDF8] transition-colors leading-snug">
                    {update.title}
                  </h3>

                  <p className="text-xs text-[#9FB0C8] leading-relaxed line-clamp-2">
                    {update.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="p-5 pt-0">
                <Link
                  to={update.link}
                  className="btn-secondary w-full text-xs py-2"
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
