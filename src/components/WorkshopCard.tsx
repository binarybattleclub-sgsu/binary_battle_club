import React from 'react';
import { Calendar, MapPin, ArrowRight, Eye } from 'lucide-react';
import { WorkshopEvent } from '../data/workshops';

interface WorkshopCardProps {
  workshop: WorkshopEvent;
  onOpenDetails: (workshop: WorkshopEvent) => void;
}

export const WorkshopCard: React.FC<WorkshopCardProps> = ({ workshop, onOpenDetails }) => {
  return (
    <div className="bg-[#0a0f1e]/85 backdrop-blur-xl rounded-3xl border border-white/10 shadow-lg hover:shadow-[0_0_30px_rgba(99,102,241,0.25)] hover:border-indigo-500/50 transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Thumbnail with Consistent Aspect Ratio */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={workshop.thumbnail}
          alt={workshop.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80';
          }}
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase bg-slate-950/80 text-cyan-300 backdrop-blur-md border border-cyan-500/30">
            {workshop.category}
          </span>
          {workshop.isExternal && (
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase bg-indigo-600/90 text-white backdrop-blur-md shadow-sm">
              Beyond Campus
            </span>
          )}
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-white mb-2 leading-snug group-hover:text-cyan-300 transition-colors">
            {workshop.title}
          </h3>

          {/* Date & Venue details */}
          <div className="space-y-1.5 mb-3 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="text-cyan-400 shrink-0" />
              <span>{workshop.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-indigo-400 shrink-0" />
              <span className="truncate">{workshop.venue}</span>
            </div>
          </div>

          {/* Short description */}
          <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 mb-4 leading-relaxed">
            {workshop.description}
          </p>
        </div>

        {/* Action Button: View Gallery / Learn More */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onOpenDetails(workshop)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-bold text-white bg-white/10 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 rounded-xl transition-all border border-white/10 hover:border-transparent group/btn"
          >
            <Eye size={14} className="text-cyan-400 group-hover:text-white" />
            <span>GALLERY & DETAILS</span>
            <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </button>

          <span className="text-[11px] font-mono text-slate-500">
            {workshop.gallery.length} Photos
          </span>
        </div>
      </div>
    </div>
  );
};
