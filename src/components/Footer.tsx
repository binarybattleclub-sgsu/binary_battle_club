import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, MapPin, Sparkles, Terminal } from 'lucide-react';
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
    <footer className="mt-20 border-t border-[#243650] bg-[#080D18] text-[#9FB0C8]">
      {/* Top Banner Accent with subtle electric blue / cyan gradient */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#2563EB] to-[#38BDF8] shadow-[0_0_15px_rgba(37,99,235,0.4)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & University Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#38BDF8] p-[1.5px] shadow-[0_0_15px_rgba(37,99,235,0.25)]">
                <img
                  src={ASSETS.brand.logo}
                  alt="Binary Battle Club Logo"
                  className="w-full h-full rounded-[10px] object-contain bg-[#080D18] p-1"
                />
              </div>
              <div>
                <h3 className="text-base font-black text-[#DCE6F5] tracking-wider">
                  BINARY BATTLE CLUB
                </h3>
                <p className="text-xs font-mono font-semibold text-[#38BDF8]">
                  Think. Code. Create. Compete.
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#9FB0C8] leading-relaxed max-w-md">
              A student-driven coding, technology, and innovation community of Scope Global Skills University (SGSU), Bhopal.
            </p>

            <div className="pt-2 text-xs text-[#9FB0C8] space-y-1.5">
              <div className="flex items-start gap-2">
                <MapPin size={15} className="text-[#38BDF8] shrink-0 mt-0.5" />
                <span>
                  <strong className="text-[#DCE6F5]">Scope Global Skills University</strong><br />
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
                className="w-9 h-9 rounded-xl bg-[#101D35] hover:bg-[#172945] hover:text-[#38BDF8] text-[#9FB0C8] flex items-center justify-center transition-all border border-[#243650] hover:border-[#38BDF8]/40"
              >
                <YoutubeIcon size={17} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Binary Battle Club Instagram"
                className="w-9 h-9 rounded-xl bg-[#101D35] hover:bg-[#172945] hover:text-[#38BDF8] text-[#9FB0C8] flex items-center justify-center transition-all border border-[#243650] hover:border-[#38BDF8]/40"
              >
                <InstagramIcon size={17} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Binary Battle Club GitHub"
                className="w-9 h-9 rounded-xl bg-[#101D35] hover:bg-[#172945] hover:text-[#38BDF8] text-[#9FB0C8] flex items-center justify-center transition-all border border-[#243650] hover:border-[#38BDF8]/40"
              >
                <GithubIcon size={17} />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8] mb-3.5">
              COMMUNITY
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-sans">
              <li>
                <Link to="/" className="text-[#9FB0C8] hover:text-[#DCE6F5] transition-colors">
                  Home Dashboard
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[#9FB0C8] hover:text-[#DCE6F5] transition-colors">
                  About Us & Vision
                </Link>
              </li>
              <li>
                <Link to="/explore-technologies" className="text-[#9FB0C8] hover:text-[#DCE6F5] transition-colors">
                  Explore & Share
                </Link>
              </li>
              <li>
                <Link to="/code-compete" className="text-[#9FB0C8] hover:text-[#DCE6F5] transition-colors">
                  Learn & Upskill
                </Link>
              </li>
            </ul>
          </div>

          {/* Initiatives & Activities */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8] mb-3.5">
              INITIATIVES
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm font-sans">
              <li>
                <Link to="/innovate-build" className="text-[#9FB0C8] hover:text-[#DCE6F5] transition-colors">
                  Create & Showcase
                </Link>
              </li>
              <li>
                <Link to="/hackathons" className="text-[#9FB0C8] hover:text-[#DCE6F5] transition-colors">
                  Events & Hackathons
                </Link>
              </li>
              <li>
                <Link to="/achievements" className="text-[#9FB0C8] hover:text-[#DCE6F5] transition-colors">
                  Hall of Triumphs
                </Link>
              </li>
              <li>
                <Link to="/join-community" className="text-[#38BDF8] hover:text-[#7dd3fc] transition-colors font-medium">
                  Join Club Membership
                </Link>
              </li>
            </ul>
          </div>

          {/* Back to Top & Quick Join */}
          <div className="flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8] mb-3.5">
                ENROLL
              </h4>
              <p className="text-xs text-[#9FB0C8] mb-3">
                Join passionate student coders, innovators and mentors across SGSU.
              </p>
              <Link
                to="/join-community"
                className="btn-primary text-xs py-2 px-4 w-full"
              >
                <Sparkles size={13} className="text-[#DCE6F5]" />
                <span>APPLY NOW</span>
              </Link>
            </div>

            {/* Back to Top Button */}
            <div className="pt-6">
              <button
                type="button"
                onClick={scrollToTop}
                className="btn-secondary text-xs py-2 px-3 w-full"
              >
                <ArrowUp size={13} />
                <span>BACK TO TOP</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="mt-12 pt-6 border-t border-[#243650] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9FB0C8]">
          <p>© {new Date().getFullYear()} Binary Battle Club • Scope Global Skills University.</p>
          <p className="flex items-center gap-1.5 font-mono text-[11px]">
            <span>Engineered with</span>
            <Terminal size={13} className="text-[#38BDF8]" />
            <span>by Student Innovators</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
