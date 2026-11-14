import React from 'react';
import { Trophy, Medal, Award, Star, Calendar, MapPin, Eye, ArrowRight, ExternalLink } from 'lucide-react';
import { AchievementItem } from '../data/achievements';

interface AchievementCardProps {
  achievement: AchievementItem;
  onOpenDetails: (achievement: AchievementItem) => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, onOpenDetails }) => {
  const renderBadgeIcon = () => {
    switch (achievement.badgeType) {
      case 'trophy':
        return <Trophy size={16} className="text-amber-400" />;
      case 'medal':
        return <Medal size={16} className="text-cyan-400" />;
      case 'star':
        return <Star size={16} className="text-yellow-400 fill-yellow-400" />;
      default:
        return <Award size={16} className="text-emerald-400" />;
    }
  };

  return (
    <div className="bg-[#0a0f1e]/85 backdrop-blur-xl rounded-3xl border border-white/10 shadow-lg hover:shadow-[0_0_30px_rgba(99,102,241,0.25)] hover:border-indigo-500/50 transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Photograph Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#040711] flex items-center justify-center p-2.5">
        <img
          src={achievement.image}
          alt={achievement.title}
          className="w-full h-full object-contain rounded-2xl group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80';
          }}
        />
      </div>

      {/* Content Area */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Award Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase bg-slate-900 text-cyan-300 border border-cyan-500/30">
              {achievement.category}
            </span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              {renderBadgeIcon()}
              <span className="truncate">{achievement.award}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 leading-snug group-hover:text-cyan-300 transition-colors">
            {achievement.title}
          </h3>

          {/* Student / Team Name */}
          <p className="text-xs font-mono font-semibold text-cyan-400 mb-2">
            {achievement.studentOrTeamName}
          </p>

          {/* Date & Competition Details */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono mb-3">
            <div className="flex items-center gap-1">
              <Calendar size={13} className="text-indigo-400" />
              <span>{achievement.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={13} className="text-indigo-400" />
              <span className="truncate">{achievement.competitionName}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 mb-4 leading-relaxed">
            {achievement.description}
          </p>
        </div>

        {/* Action Button: View Details & Photographs */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenDetails(achievement)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-bold text-white bg-white/10 hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-600 rounded-xl transition-all border border-white/10 hover:border-transparent group/btn"
            >
              <Eye size={14} className="text-amber-400 group-hover:text-white" />
              <span>VIEW PHOTOGRAPHS</span>
              <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>

            {achievement.link && (
              <a
                href={achievement.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/25 rounded-xl transition-all border border-cyan-500/30 hover:border-cyan-400 group/link"
                title="Visit Live Portal"
              >
                <ExternalLink size={13} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                <span>VISIT PORTAL</span>
              </a>
            )}
          </div>

          <span className="text-[11px] font-mono text-emerald-400 shrink-0">
            VERIFIED
          </span>
        </div>
      </div>
    </div>
  );
};
