import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Info,
  Cpu,
  GraduationCap,
  Rocket,
  Flame,
  Trophy,
  Users,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Terminal,
} from 'lucide-react';
import { ASSETS } from '../data/assets';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
}

export const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/about', label: 'About', icon: Info },
  { path: '/team', label: 'The Team', icon: Users },
  { path: '/explore-technologies', label: 'Explore & Share', icon: Cpu },
  { path: '/code-compete', label: 'Learn & Upskill', icon: GraduationCap },
  { path: '/innovate-build', label: 'Create & Showcase', icon: Rocket },
  { path: '/hackathons', label: 'Events', icon: Flame },
  { path: '/achievements', label: 'Achievements', icon: Trophy },
  { path: '/join-community', label: 'Join the Community', icon: UserPlus, highlight: true },
];

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const location = useLocation();

  const handleLinkClick = () => {
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#05060A] text-slate-300 border-r border-white/10 transition-all duration-300 ease-in-out select-none
          ${collapsed ? 'lg:w-20' : 'lg:w-64'}
          ${mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Top Branding */}
        <div className="h-20 px-3.5 flex items-center justify-between border-b border-white/10 bg-[#040407]">
          <NavLink
            to="/"
            onClick={handleLinkClick}
            className="flex items-center gap-3 overflow-hidden group focus:outline-none"
          >
            <div className="relative flex items-center justify-center w-[50px] h-[50px] sm:w-[54px] sm:h-[54px] rounded-2xl bg-gradient-to-tr from-rose-500 via-rose-600 to-amber-500 p-[2px] shrink-0 shadow-[0_0_20px_rgba(255,30,86,0.35)] ring-1 ring-white/20 group-hover:shadow-[0_0_30px_rgba(255,30,86,0.55)] group-hover:scale-105 transition-all">
              <img
                src={ASSETS.brand.logo}
                alt="Binary Battle Club Logo"
                className="w-full h-full object-contain rounded-[14px] bg-[#05060A] p-1"
              />
              <span className="sr-only">Binary Battle Club</span>
            </div>

            {(!collapsed || mobileOpen) && (
              <div className="flex flex-col min-w-0 transition-opacity duration-200 pl-0.5">
                <span className="text-[14px] font-black tracking-wider uppercase truncate leading-tight text-white flex items-center gap-1">
                  <span className="text-[#FF1E56] font-bold tracking-normal">{"{ }"}</span>
                  <span>BINARY BATTLE</span>
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[11px] font-black tracking-[0.22em] text-[#FF1E56] uppercase">
                    CLUB
                  </span>
                  <span className="text-[10px] text-slate-600 font-bold">//</span>
                  <span className="text-[11px] font-black tracking-[0.25em] text-slate-300">
                    SGSU
                  </span>
                </div>
              </div>
            )}
          </NavLink>

          {/* Desktop collapse toggle button */}
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Menu Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto dark-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                title={collapsed && !mobileOpen ? item.label : undefined}
                className={`relative flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm transition-all group font-medium
                  ${
                    isActive
                      ? 'bg-rose-500/10 text-white border-l-4 border-[#FF1E56] shadow-[inset_0_0_15px_rgba(255,30,86,0.15)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border-l-4 border-transparent'
                  }
                  ${item.highlight && !isActive ? 'hover:text-rose-400' : ''}
                `}
              >
                <div
                  className={`flex items-center justify-center shrink-0 transition-colors
                    ${isActive ? 'text-[#FF1E56]' : 'text-slate-400 group-hover:text-slate-200'}
                  `}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                </div>

                {(!collapsed || mobileOpen) && (
                  <span className="truncate flex-1">{item.label}</span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
