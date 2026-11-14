import React from 'react';
import { MembershipForm } from '../components/MembershipForm';

export const JoinCommunity: React.FC = () => {
  return (
    <div className="relative min-h-[85vh] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center overflow-hidden bg-[#07090e]">
      {/* Dark moody atmospheric background with subtle mist & textures */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-luminosity pointer-events-none filter contrast-125"
        style={{ backgroundImage: `url('/images/join_bg_clean.jpg')` }}
      />

      {/* Atmospheric radial darkening / vignettes */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_#07090e_85%)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#07090e] via-transparent to-[#07090e] pointer-events-none" />

      {/* Giant Typography Watermark spanning across the background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <span className="text-[14vw] sm:text-[11vw] font-black uppercase tracking-tighter text-white/[0.12] leading-none whitespace-nowrap select-none">
          LET'S CREATE TOGETHER
        </span>
      </div>

      {/* Centered Frosted Glass Form Card */}
      <div className="relative z-10 max-w-2xl w-full mx-auto backdrop-blur-2xl bg-[#0e121b]/40 border border-white/10 rounded-md p-8 sm:p-12 shadow-[0_20px_70px_rgba(0,0,0,0.9)]">
        <MembershipForm />
      </div>
    </div>
  );
};