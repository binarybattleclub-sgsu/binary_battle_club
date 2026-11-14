import React from 'react';
import { Rocket } from 'lucide-react';

export const InnovateAndBuild: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div className="bg-[#0a0f1e]/85 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-sky-500/10 text-cyan-300 border border-cyan-500/30 mb-3 shadow-[0_0_15px_rgba(0,242,254,0.2)]">
            <Rocket size={14} />
            <span>CREATE & SHOWCASE // SGSU</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2.5">
            Create & Showcase
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
            "Collaborate across disciplines, exchange ideas and transform creative thinking into innovative prototypes, projects and real-world solutions."
          </p>
        </div>
      </div>
    </div>
  );
};
