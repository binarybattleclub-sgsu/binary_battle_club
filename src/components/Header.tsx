import React from 'react';
import { Menu, Terminal } from 'lucide-react';
import { ASSETS } from '../data/assets';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  collapsed: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileMenu }) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 sm:h-18 px-4 sm:px-8 bg-[#080D18]/85 backdrop-blur-2xl border-b border-[#243650] transition-all">
      <div className="flex items-center gap-4">
        {/* Hamburger trigger visible on mobile / tablet */}
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-[#9FB0C8] hover:text-[#DCE6F5] hover:bg-[#172945] border border-transparent hover:border-[#243650] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        {/* Mobile branding */}
        <div className="lg:hidden flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#38BDF8] p-[1.5px] shadow-[0_0_12px_rgba(37,99,235,0.25)]">
            <img
              src={ASSETS.brand.logo}
              alt="Binary Battle Club"
              className="w-full h-full rounded-[9px] object-contain bg-[#080D18] p-0.5"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black tracking-wider uppercase leading-tight text-[#DCE6F5]">
              BINARY BATTLE
            </span>
            <span className="text-[9.5px] font-bold tracking-[0.2em] text-[#38BDF8] uppercase">
              CLUB // SGSU
            </span>
          </div>
        </div>
      </div>

      {/* Right side technical status indicator */}
      <div className="hidden sm:flex items-center gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101D35] border border-[#243650] text-[11px] font-mono text-[#9FB0C8]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
          <span className="text-[#DCE6F5] font-semibold">SGSU NODE</span>
          <span className="text-[#243650]">//</span>
          <span className="text-[#38BDF8]">ONLINE</span>
        </div>
      </div>
    </header>
  );
};
