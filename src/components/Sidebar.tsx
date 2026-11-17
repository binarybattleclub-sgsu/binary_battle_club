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
} from 'lucide-react';
import { ASSETS } from '../data/assets';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void;
  mobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
}

const navItems = [
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
          className="fixed inset-0 bg-[#080D18]/80 backdrop-blur-md z-40 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#101D35] text-[#9FB0C8] border-r border-[#243650] transition-all duration-300 ease-in-out select-none
          ${collapsed ? 'lg:w-20' : 'lg:w-64'}
          ${mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Top Branding Header */}
        <div className="h-20 px-3.5 flex items-center justify-between border-b border-[#243650] bg-[#080D18]">
          <NavLink
            to="/"
            onClick={handleLinkClick}
            className="flex items-center gap-3 overflow-hidden group focus:outline-none"
          >
            {/* Logo with technical Cyan/Electric-Blue gradient edge */}
            <div className="relative flex items-center justify-center w-[48px] h-[48px] rounded-xl bg-gradient-to-br from-[#2563EB] to-[#38BDF8] p-[1.5px] shrink-0 shadow-[0_0_15px_rgba(37,99,235,0.25)] ring-1 ring-[#243650] group-hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] group-hover:scale-105 transition-all duration-300">
              <img
                src={ASSETS.brand.logo}
                alt="Binary Battle Club Logo"
                className="w-full h-full object-contain rounded-[10px] bg-[#080D18] p-1"
              />
              <span className="sr-only">Binary Battle Club</span>
            </div>

            {/* Brand text */}
            {(!collapsed || mobileOpen) && (
              <div className="flex flex-col min-w-0 transition-opacity duration-200 pl-0.5 whitespace-nowrap">
                <span className="text-[13.5px] font-black tracking-wider uppercase leading-tight text-[#DCE6F5] flex items-center gap-1">
                  <span className="text-[#38BDF8] font-mono font-bold tracking-tight">{"{ }"}</span>
                  <span className="truncate">BINARY BATTLE</span>
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10.5px] font-bold tracking-[0.22em] text-[#38BDF8] uppercase">
                    CLUB
                  </span>
                  <span className="text-[10px] text-[#243650] font-bold">//</span>
                  <span className="text-[10.5px] font-medium tracking-[0.2em] text-[#9FB0C8]">
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
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-[#9FB0C8] hover:text-[#DCE6F5] hover:bg-[#172945] border border-transparent hover:border-[#243650] transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Menu Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                title={collapsed && !mobileOpen ? item.label : undefined}
                className={`relative flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group font-medium
                  ${
                    isActive
                      ? 'bg-[#172945] text-[#DCE6F5] border-l-[3px] border-[#2563EB] shadow-[inset_0_0_15px_rgba(37,99,235,0.12)]'
                      : 'text-[#9FB0C8] hover:text-[#DCE6F5] hover:bg-[#172945]/60 border-l-[3px] border-transparent'
                  }
                  ${item.highlight && !isActive ? 'hover:text-[#38BDF8]' : ''}
                `}
              >
                <div
                  className={`flex items-center justify-center shrink-0 transition-colors duration-200
                    ${isActive ? 'text-[#38BDF8]' : 'text-[#9FB0C8] group-hover:text-[#DCE6F5]'}
                  `}
                >
                  <Icon size={19} strokeWidth={isActive ? 2.2 : 1.8} />
                </div>

                {(!collapsed || mobileOpen) && (
                  <span className="truncate flex-1 tracking-tight text-[13.5px]">{item.label}</span>
                )}

                {isActive && (!collapsed || mobileOpen) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] shadow-[0_0_6px_#38BDF8] shrink-0" />
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
