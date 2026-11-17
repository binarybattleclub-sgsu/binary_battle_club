import React from 'react';
import { ASSETS } from '../data/assets';

interface AiRobotVisualProps {
  customImage?: string;
}

export const AiRobotVisual: React.FC<AiRobotVisualProps> = ({ customImage }) => {
  const imageSrc = customImage || ASSETS.brand.aiRobot;

  return (
    <div className="relative flex items-center justify-center select-none w-full">
      {/* Soft ambient navy and cyan glow behind the visual */}
      <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-br from-[#2563EB]/20 via-[#101D35]/40 to-[#38BDF8]/15 blur-3xl pointer-events-none" />

      {/* Pure 3D Visual with soft feathered edges */}
      <div className="relative w-full max-w-[420px] lg:max-w-[460px] aspect-square flex items-center justify-center">
        <img
          src={imageSrc}
          alt="Binary Battle Club AI Robot"
          className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(37,99,235,0.25)] hover:scale-105 transition-transform duration-700 [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_98%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_98%)]"
        />
      </div>
    </div>
  );
};
