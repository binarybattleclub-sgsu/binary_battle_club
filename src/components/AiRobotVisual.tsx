import React from 'react';
import { ASSETS } from '../data/assets';

interface AiRobotVisualProps {
  customImage?: string;
}

export const AiRobotVisual: React.FC<AiRobotVisualProps> = ({ customImage }) => {
  const imageSrc = customImage || ASSETS.brand.aiRobot;

  return (
    <div className="relative flex items-center justify-center select-none w-full">
      {/* Soft ambient neon glow behind the robot */}
      <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-tr from-cyan-500/25 via-indigo-600/20 to-purple-600/25 blur-3xl pointer-events-none" />

      {/* Pure 3D Robot Image with soft feathered edges blending into the background */}
      <div className="relative w-full max-w-[420px] lg:max-w-[460px] aspect-square flex items-center justify-center">
        <img
          src={imageSrc}
          alt="Binary Battle Club AI Robot"
          className="w-full h-full object-contain filter drop-shadow-[0_0_40px_rgba(0,242,254,0.35)] hover:scale-105 transition-transform duration-700 [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_98%)] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_98%)]"
        />
      </div>
    </div>
  );
};
