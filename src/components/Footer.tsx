import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, MapPin, Heart, Sparkles, Terminal } from 'lucide-react';
import { YoutubeIcon, InstagramIcon, GithubIcon } from './SocialIcons';
import { ASSETS } from '../data/assets';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="mt-20 border-t border-white/10 bg-[#050811] text-slate-300">
      {/* Top Banner Accent with glowing gradient */}
      <div className="h-0.5 w-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 shadow-[0_0_15px_rgba(0,242,254,0.5)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & University Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={ASSETS.brand.logo}
                alt="Binary Battle Club Logo"
                className="w-10 h-10 rounded-xl object-contain bg-[#0a0f1e] p-1 border border-white/10 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
              />
              <div>
                <h3 className="text-base font-black text-white tracking-wider">
                  BINARY BATTLE CLUB
                </h3>
                <p className="text-xs font-semibold text-cyan-400">
                  Think. Code. Create. Compete.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              A student-driven coding, technology, and innovation community of Scope Global Skills University (SGSU), Bhopal.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-start gap-2">
                <MapPin size={15} className="text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">Scope Global Skills University</strong><br />
                  School of Future Skills and Information Technology<br />
                  Bhopal, Madhya Pradesh, India.
                </span>
              </div>
            </div>

            {/* Social media links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Binary Battle Club YouTube Channel"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 flex items-center justify-center transition-all border border-white/10"
              >
                <YoutubeIcon size={17} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Binary Battle Club Instagram"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-pink-500/20 hover:text-pink-400 text-slate-400 flex items-center justify-center transition-all border border-white/10"
              >
                <InstagramIcon size={17} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Binary Battle Club GitHub"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-400 flex items-center justify-center transition-all border border-white/10"
              >
                <GithubIcon size={17} />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3.5">
              COMMUNITY
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-sans">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home Dashboard
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors">
                  About Us & Vision
                </Link>
              </li>
              <li>
                <Link to="/explore-technologies" className="text-slate-400 hover:text-white transition-colors">
                  Explore & Share
                </Link>
              </li>
              <li>
                <Link to="/code-compete" className="text-slate-400 hover:text-white transition-colors">
                  Learn & Upskill
                </Link>
              </li>
            </ul>
          </div>

          {/* Initiatives & Activities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3.5">
              INITIATIVES
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-sans">
              <li>
                <Link to="/innovate-build" className="text-slate-400 hover:text-white transition-colors">
                  Create & Showcase
                </Link>
              </li>
              <li>
                <Link to="/hackathons" className="text-slate-400 hover:text-white transition-colors">
                  Events & Hackathons
                </Link>
              </li>
              <li>
                <Link to="/achievements" className="text-slate-400 hover:text-white transition-colors">
                  Hall of Triumphs
                </Link>
              </li>
              <li>
                <Link to="/join-community" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                  Join Club Membership
                </Link>
              </li>
            </ul>
          </div>

          {/* Back to Top & Quick Join */}
          <div className="flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3.5">
                ENROLL
              </h4>
              <p className="text-xs text-slate-400 mb-3">
                Join passionate student coders, innovators and mentors across SGSU.
              </p>
              <Link
                to="/join-community"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)]"
              >
                <Sparkles size={13} className="text-cyan-300" />
                <span>APPLY NOW</span>
              </Link>
            </div>

            {/* Back to Top Button */}
            <div className="pt-6">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs transition-colors border border-white/10"
              >
                <ArrowUp size={13} />
                <span>BACK TO TOP</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Binary Battle Club • Scope Global Skills University.</p>
          <p className="flex items-center gap-1.5">
            Crafted with <Heart size={12} className="text-rose-500 fill-rose-500" /> by Student Innovators
          </p>
        </div>
      </div>
    </footer>
  );
};
