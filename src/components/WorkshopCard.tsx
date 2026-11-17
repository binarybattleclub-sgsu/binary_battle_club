import React from 'react';
import { Calendar, MapPin, ArrowRight, Eye } from 'lucide-react';
import { WorkshopEvent } from '../data/workshops';

interface WorkshopCardProps {
  workshop: WorkshopEvent;
  onOpenDetails: (workshop: WorkshopEvent) => void;
}

export const WorkshopCard: React.FC<WorkshopCardProps> = ({ workshop, onOpenDetails }) => {
  return (
    <div className="bg-[#101D35]/85 backdrop-blur-xl rounded-3xl border border-[#243650] shadow-lg hover:shadow-[0_12px_35px_rgba(8,13,24,0.8),0_0_20px_rgba(37,99,235,0.18)] hover:border-[#38BDF8]/40 hover:bg-[#172945]/90 transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Thumbnail with Consistent Aspect Ratio */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#080D18]">
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
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase bg-[#080D18]/85 text-[#38BDF8] backdrop-blur-md border border-[#243650]">
            {workshop.category}
          </span>
          {workshop.isExternal && (
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase bg-[#2563EB] text-[#DCE6F5] backdrop-blur-md shadow-sm">
              Beyond Campus
            </span>
          )}
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-[#DCE6F5] mb-2 leading-snug group-hover:text-[#38BDF8] transition-colors">
            {workshop.title}
          </h3>

          {/* Date & Venue details */}
          <div className="space-y-1.5 mb-3 text-xs text-[#9FB0C8] font-mono">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="text-[#38BDF8] shrink-0" />
              <span>{workshop.date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={13} className="text-[#38BDF8] shrink-0" />
              <span className="truncate">{workshop.venue}</span>
            </div>
          </div>

          {/* Short description */}
          <p className="text-xs sm:text-sm text-[#9FB0C8] line-clamp-3 mb-4 leading-relaxed">
            {workshop.description}
          </p>
        </div>

        {/* Action Button: View Gallery / Learn More */}
        <div className="pt-3 border-t border-[#243650] flex items-center justify-between">
          <button
            type="button"
            onClick={() => onOpenDetails(workshop)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-bold text-[#DCE6F5] bg-[#101D35] hover:bg-[#2563EB] rounded-xl transition-all border border-[#243650] hover:border-[#2563EB] group/btn"
          >
            <Eye size={14} className="text-[#38BDF8] group-hover:text-[#DCE6F5]" />
            <span>GALLERY & DETAILS</span>
            <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </button>

          <span className="text-[11px] font-mono text-[#9FB0C8]">
            {workshop.gallery.length} Photos
          </span>
        </div>
      </div>
    </div>
  );
};
