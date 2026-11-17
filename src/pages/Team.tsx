import React from 'react';
import { Users } from 'lucide-react';
import { ASSETS } from '../data/assets';

export const Team: React.FC = () => {
  return (
    <div className="space-y-8 text-[#DCE6F5]">
      {/* Page Header */}
      <div className="relative bg-[#101D35]/85 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-[#243650] shadow-[0_12px_35px_rgba(8,13,24,0.8)] overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#2563EB]/15 text-[#38BDF8] border border-[#2563EB]/30 mb-3 shadow-[0_0_15px_rgba(37,99,235,0.15)]">
          <Users size={14} />
          <span>STUDENT_LEADERSHIP // BINARY_BATTLE_CLUB</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#DCE6F5] tracking-tight leading-tight">
          The Team
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#9FB0C8] max-w-2xl leading-relaxed">
          Student innovators, peer mentors, and technical organizers steering initiatives and competitions across Scope Global Skills University.
        </p>
      </div>

      {/* Official Team Photograph Showcase */}
      <div className="relative bg-[#101D35]/85 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-[#243650] shadow-[0_12px_35px_rgba(8,13,24,0.8)] overflow-hidden">
        <div className="relative overflow-hidden rounded-2xl border border-[#243650] bg-[#080D18] shadow-2xl">
          <img
            src={ASSETS.team.main}
            alt="Binary Battle Club Team Leaders"
            className="w-full h-auto object-contain rounded-2xl transition-transform duration-700 hover:scale-[1.01]"
          />
        </div>
      </div>
    </div>
  );
};
