import React from 'react';
import { Users } from 'lucide-react';
import { ASSETS } from '../data/assets';

export const Team: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="relative bg-[#0a0f1e]/85 backdrop-blur-xl rounded-3xl p-6 sm:p-10 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-indigo-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,242,254,0.2)] mb-3">
          <Users size={14} />
          <span>STUDENT_LEADERSHIP // BINARY_BATTLE_CLUB</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
          The Team
        </h1>
      </div>

      {/* Official Team Photograph Showcase */}
      <div className="relative bg-[#0a0f1e]/85 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 shadow-2xl">
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