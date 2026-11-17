import React from 'react';
import { MembershipForm } from '../components/MembershipForm';

export const JoinCommunity: React.FC = () => {
  return (
    <div className="relative min-h-[85vh] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center overflow-hidden bg-[#080D18]">
      {/* Dark moody atmospheric background with subtle mist & textures */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity pointer-events-none filter contrast-125"
        style={{ backgroundImage: `url('/images/join_bg_clean.jpg')` }}
      />

      {/* Atmospheric radial darkening / vignettes */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_#080D18_85%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#080D18] via-transparent to-[#080D18] pointer-events-none" />

      {/* Subtle blue ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Giant Typography Watermark spanning across the background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <span className="text-[14vw] sm:text-[11vw] font-black uppercase tracking-tighter text-[#DCE6F5]/[0.06] leading-none whitespace-nowrap select-none font-mono">
          LET&apos;S CREATE TOGETHER
        </span>
      </div>

      {/* Centered Glass Form Card */}
      <div className="relative z-10 max-w-2xl w-full mx-auto backdrop-blur-2xl bg-[#101D35]/85 border border-[#243650] rounded-2xl p-8 sm:p-12 shadow-[0_25px_70px_rgba(8,13,24,0.95),0_0_30px_rgba(37,99,235,0.12)]">
        <MembershipForm />
      </div>
    </div>
  );
};
