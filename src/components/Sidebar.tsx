import React, { useEffect, useRef } from 'react';
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
  ChevronsRight,
  ChevronsLeft,
  X,
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
  const asideRef = useRef<HTMLElement>(null);

  const handleLinkClick = () => {
    if (mobileOpen) {
      setMobileOpen(false);
    }
  };

  // Close mobile drawer or collapse expanded desktop float on Escape or outside click
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (mobileOpen) setMobileOpen(false);
        if (!collapsed) setCollapsed(true);
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      if (
        !collapsed &&
        asideRef.current &&
        !asideRef.current.contains(e.target as Node) &&
        window.innerWidth >= 1024
      ) {
        setCollapsed(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handlePointerDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [collapsed, mobileOpen, setCollapsed, setMobileOpen]);

  const showLabels = !collapsed || mobileOpen;

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-[#080D18]/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Floating Editorial Navigation Rail */}
      <aside
        ref={asideRef}
        aria-label="Global Club Navigation"
        className={`fixed top-0 bottom-0 left-0 lg:top-4 lg:bottom-4 lg:left-4 z-50 flex flex-col overflow-hidden
          bg-[#101D35]/92 backdrop-blur-md text-[#9FB0C8]
          border-r lg:border border-[#243650]
          lg:rounded-2xl shadow-[0_22px_55px_-10px_rgba(4,7,15,0.9),0_0_0_1px_rgba(56,189,248,0.08)]
          transition-[width,transform,box-shadow] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] select-none
          ${collapsed ? 'lg:w-[82px]' : 'lg:w-[264px]'}
          ${mobileOpen ? 'translate-x-0 w-72 rounded-r-2xl' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Top Floating Rail Brand & Toggle Container */}
        <div
          className={`shrink-0 border-b border-[#243650]/80 bg-[#080D18]/60 lg:rounded-t-2xl transition-all duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            showLabels
              ? 'h-20 px-4 flex flex-row items-center justify-between gap-2.5'
              : 'py-3.5 px-2 flex flex-col items-center justify-center gap-2.5'
          }`}
        >
          <NavLink
            to="/"
            onClick={handleLinkClick}
            aria-label="Binary Battle Club Home"
            className={`flex items-center min-w-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] rounded-xl ${
              showLabels ? 'gap-3 flex-1 overflow-hidden' : 'justify-center w-11 h-11 shrink-0'
            }`}
          >
            {/* Unclipped Logo Emblem strictly bounded inside sidebar */}
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#080D18] border border-[#243650] group-hover:border-[#38BDF8]/70 shrink-0 transition-all duration-200 shadow-sm overflow-hidden">
              <img
                src={ASSETS.brand.logo}
                alt="Binary Battle Club Logo"
                className="w-full h-full object-contain rounded-[10px] p-1"
              />
            </div>

            {/* Complete Unclipped Brand Wordmark */}
            {showLabels && (
              <div className="flex flex-col min-w-0 leading-none animate-fade-in overflow-hidden">
                <div className="flex items-center gap-1.5 whitespace-nowrap">
                  <span className="font-mono text-[#38BDF8] text-xs font-semibold">{'//'}</span>
                  <span className="font-sans font-bold text-sm tracking-[-0.01em] text-[#DCE6F5] uppercase">
                    Binary Battle
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 whitespace-nowrap">
                  <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#38BDF8]">
                    Club
                  </span>
                  <span className="text-[9px] font-mono text-[#9FB0C8]/60">01</span>
                </div>
              </div>
            )}
          </NavLink>

          {/* Desktop Toggle Button - Centered below logo when collapsed, right-aligned when expanded */}
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={`hidden lg:flex items-center justify-center rounded-lg text-[#9FB0C8] hover:text-[#DCE6F5] bg-[#080D18]/85 hover:bg-[#172945] border border-[#243650] hover:border-[#38BDF8]/50 transition-all duration-200 cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] ${
              collapsed ? 'w-10 h-7' : 'w-8 h-8'
            }`}
          >
            {collapsed ? <ChevronsRight size={15} /> : <ChevronsLeft size={15} />}
          </button>

          {/* Mobile Close Button */}
          {mobileOpen && (
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-2 rounded-lg text-[#9FB0C8] hover:text-[#DCE6F5] hover:bg-[#172945]"
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav
          className="flex-1 min-h-0 px-2.5 py-4 space-y-1.5 overflow-y-auto overflow-x-hidden"
          aria-label="Primary Navigation"
        >
          {showLabels && (
            <div className="px-2.5 pb-2 mb-1.5 flex items-center justify-between border-b border-[#243650]/70 whitespace-nowrap">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#9FB0C8]/75">
                Directory
              </span>
              <span className="text-[10px] font-mono text-[#38BDF8]/80">09</span>
            </div>
          )}

          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname === item.path ||
                  (item.path === '/innovate-build' &&
                    (location.pathname.startsWith('/innovate-build') ||
                      location.pathname.startsWith('/create-showcase')));
            const itemNum = String(idx + 1).padStart(2, '0');

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                title={!showLabels ? item.label : undefined}
                aria-label={item.label}
                className={`relative flex items-center rounded-xl transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]
                  ${
                    showLabels
                      ? 'w-full gap-3 px-3 py-2.5 justify-start'
                      : 'w-11 h-10 mx-auto px-0 py-0 justify-center'
                  }
                  ${
                    isActive
                      ? 'bg-[#172945] text-[#DCE6F5] font-semibold shadow-sm border border-[#2563EB]/40'
                      : 'text-[#9FB0C8] hover:text-[#DCE6F5] hover:bg-[#172945]/65 font-medium border border-transparent'
                  }
                  ${
                    item.highlight && !isActive
                      ? 'mt-2.5 border-[#2563EB]/40 bg-[#2563EB]/10 hover:bg-[#2563EB]/20 hover:border-[#38BDF8]/50 text-[#DCE6F5]'
                      : ''
                  }
                `}
              >
                {/* Floating Active Marker Pill */}
                {isActive && (
                  <span
                    className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r bg-[#38BDF8] shadow-[0_0_10px_rgba(56,189,248,0.65)] transition-all duration-200"
                    aria-hidden="true"
                  />
                )}

                <div
                  className={`flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105
                    ${
                      isActive
                        ? 'text-[#38BDF8]'
                        : item.highlight
                        ? 'text-[#38BDF8]'
                        : 'text-[#9FB0C8] group-hover:text-[#DCE6F5]'
                    }
                  `}
                >
                  <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                </div>

                {showLabels && (
                  <div
                    style={{ transitionDelay: `${idx * 22}ms` }}
                    className="flex items-center justify-between flex-1 min-w-0 transition-all duration-200 overflow-hidden"
                  >
                    <span className="truncate text-[13.5px] tracking-[-0.01em] whitespace-nowrap">
                      {item.label}
                    </span>
                    <span
                      className={`font-mono text-[10px] tracking-wider ml-2 shrink-0 transition-colors ${
                        isActive ? 'text-[#38BDF8]' : 'text-[#9FB0C8]/45 group-hover:text-[#9FB0C8]'
                      }`}
                    >
                      {itemNum}
                    </span>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Editorial Colophon Metadata */}
        <div
          className={`shrink-0 border-t border-[#243650]/80 bg-[#080D18]/60 lg:rounded-b-2xl text-[10px] font-mono text-[#9FB0C8]/75 transition-all duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            showLabels
              ? 'px-4 py-3.5 space-y-0.5'
              : 'py-3 px-2 flex flex-col items-center justify-center'
          }`}
        >
          {showLabels ? (
            <>
              <div className="flex items-center justify-between text-[#DCE6F5]/85 whitespace-nowrap">
                <span>SGSU CHAPTER</span>
                <span className="text-[#38BDF8]">2026</span>
              </div>
              <p className="truncate text-[#9FB0C8]/65">School of Future Skills &amp; IT</p>
            </>
          ) : (
            <span className="text-[9px] text-[#38BDF8] font-bold tracking-widest">SGSU</span>
          )}
        </div>
      </aside>
    </>
  );
};
