import React from 'react';
import { Menu } from 'lucide-react';
import { ASSETS } from '../data/assets';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  collapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu, collapsed }) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-18 px-4 sm:px-8 bg-[#05060A]/85 backdrop-blur-2xl border-b border-white/[0.08] transition-all">
      <div className="flex items-center gap-4">
        {/* Hamburger trigger visible on mobile / tablet */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        {/* Mobile branding */}
        <div className="lg:hidden flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-rose-600 to-amber-500 p-[1.5px] shadow-[0_0_15px_rgba(255,30,86,0.3)]">
            <img
              src={ASSETS.brand.logo}
              alt="Binary Battle Club"
              className="w-full h-full rounded-[10px] object-contain bg-[#05060A] p-0.5"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black tracking-wider uppercase leading-tight text-white">
              BINARY BATTLE
            </span>
            <span className="text-[9.5px] font-bold tracking-[0.2em] text-[#FF1E56] uppercase">
              CLUB // SGSU
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
