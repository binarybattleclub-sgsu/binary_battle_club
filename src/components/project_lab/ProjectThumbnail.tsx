import React, { useState } from 'react';
import { Code2, Shield, Brain, Sparkles, FolderGit2 } from 'lucide-react';
import { ProjectLabItem } from '../../data/projectLabData';

interface ProjectThumbnailProps {
  project: ProjectLabItem;
  className?: string;
  imageClassName?: string;
  aspectRatio?: string;
  showCategoryBadge?: boolean;
}

export const ProjectThumbnail: React.FC<ProjectThumbnailProps> = ({
  project,
  className = '',
  imageClassName = '',
  aspectRatio = 'aspect-[16/10]',
  showCategoryBadge = false,
}) => {
  const [imageError, setImageError] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI Projects':
        return <Brain className="text-[#38BDF8]" size={28} />;
      case 'Cybersecurity':
        return <Shield className="text-emerald-400" size={28} />;
      case 'Web Development':
      default:
        return <Code2 className="text-[#60A5FA]" size={28} />;
    }
  };

  const getInitials = (title: string) => {
    const words = title.replace(/[^a-zA-Z0-9\s]/g, '').trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return title.slice(0, 2).toUpperCase();
  };

  const hasImage = Boolean(project.thumbnailAsset && !imageError);

  return (
    <div
      className={`relative w-full ${aspectRatio} overflow-hidden bg-[#080D18] flex items-center justify-center ${className}`}
    >
      {hasImage ? (
        <img
          src={project.thumbnailAsset}
          alt={project.title}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${imageClassName}`}
          onError={() => {
            setImageError(true);
          }}
        />
      ) : (
        /* Midnight Navy Cybernetic Fallback Placeholder */
        <div className="absolute inset-0 bg-gradient-to-br from-[#101D35] via-[#0D1829] to-[#080D18] flex flex-col items-center justify-center p-6 text-center select-none border border-[#243650]/40">
          {/* Subtle grid pattern background */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #38BDF8 1px, transparent 0)`,
              backgroundSize: '16px 16px',
            }}
          />

          {/* Ambient Glow */}
          <div className="absolute w-24 h-24 bg-[#2563EB]/15 rounded-full blur-xl pointer-events-none" />

          {/* Icon Badge */}
          <div className="relative w-12 h-12 rounded-2xl bg-[#101D35] border border-[#2563EB]/40 flex items-center justify-center shadow-lg mb-2 group-hover:scale-105 transition-transform">
            {getCategoryIcon(project.category)}
          </div>

          {/* Initials & Category */}
          <span className="relative text-xs font-mono font-bold tracking-wider text-[#38BDF8] uppercase mb-1">
            {getInitials(project.title)} // {project.category}
          </span>
          <p className="relative text-xs text-[#9FB0C8] line-clamp-1 max-w-[85%] font-medium">
            {project.title}
          </p>
        </div>
      )}

      {/* Subtle bottom shadow vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#101D35]/90 via-transparent to-black/30 pointer-events-none" />
    </div>
  );
};
