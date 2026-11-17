import React from 'react';
import { Calendar, MapPin, Clock, Award, Sparkles, Image as ImageIcon, ArrowRight } from 'lucide-react';
import { HackathonEvent } from '../data/hackathons';

interface HackathonCardProps {
  hackathon: HackathonEvent;
  onOpenGallery: (hackathon: HackathonEvent) => void;
}

export const HackathonCard: React.FC<HackathonCardProps> = ({ hackathon, onOpenGallery }) => {
  const isUpcoming = hackathon.status.toLowerCase().includes('upcoming');

  return (
    <div
      className={`bg-[#101D35]/85 backdrop-blur-xl rounded-3xl border transition-all duration-300 overflow-hidden shadow-xl flex flex-col lg:flex-row ${
        isUpcoming
          ? 'border-[#38BDF8]/60 shadow-[0_12px_40px_rgba(8,13,24,0.9),0_0_25px_rgba(37,99,235,0.25)] ring-1 ring-[#38BDF8]/30'
          : 'border-[#243650] hover:border-[#38BDF8]/40 hover:bg-[#172945]/90 hover:shadow-[0_12px_35px_rgba(8,13,24,0.8),0_0_20px_rgba(37,99,235,0.15)]'
      }`}
    >
      {/* Event Cover Photo */}
      <div className="relative lg:w-5/12 aspect-video lg:aspect-auto overflow-hidden bg-[#080D18] shrink-0">
        <img
          src={hackathon.coverImage}
          alt={hackathon.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 opacity-90 hover:opacity-100"
        />

        {/* Status Badge */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {isUpcoming ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#2563EB] text-[#DCE6F5] shadow-lg shadow-[#2563EB]/30">
              <Sparkles size={13} className="text-[#38BDF8] animate-spin" />
              UPCOMING_SPRINT
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#101D35] text-[#38BDF8] border border-[#243650] shadow-md">
              <Award size={13} />
              FLAGSHIP_SPRINT
            </span>
          )}

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-[#080D18]/85 text-[#38BDF8] backdrop-blur-md border border-[#243650]">
            <Clock size={12} />
            {hackathon.duration}
          </span>
        </div>

        {/* Gallery count tag */}
        <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-lg bg-[#080D18]/85 text-[#9FB0C8] text-xs font-mono backdrop-blur-md border border-[#243650] flex items-center gap-1.5">
          <ImageIcon size={13} className="text-[#38BDF8]" />
          <span>{hackathon.gallery.length} PHOTOS</span>
        </div>
      </div>

      {/* Content & Details */}
      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
        <div>
          {/* Header & Title */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h3 className="text-lg sm:text-xl font-bold text-[#DCE6F5] tracking-tight">
              {hackathon.title}
            </h3>
          </div>

          {/* Venue & Date */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#9FB0C8] font-mono mb-4">
            <div className="flex items-center gap-1.5">
              <MapPin size={15} className="text-[#38BDF8] shrink-0" />
              <span>{hackathon.venue}</span>
            </div>
            {hackathon.date && (
              <div className="flex items-center gap-1.5">
                <Calendar size={15} className="text-[#38BDF8] shrink-0" />
                <span>{hackathon.date}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-[#9FB0C8] leading-relaxed mb-6 font-normal">
            {hackathon.shortDescription}
          </p>

          {/* Highlights */}
          <div className="mb-6">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8] mb-2.5">
              SPRINT_HIGHLIGHTS:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {hackathon.highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-[#9FB0C8]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] mt-1.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action and Stats Strip */}
        <div className="pt-4 border-t border-[#243650] flex flex-wrap items-center justify-between gap-4">
          {/* Mini Stats */}
          <div className="flex items-center gap-4 sm:gap-6 font-mono">
            {hackathon.stats.slice(0, 2).map((s, idx) => (
              <div key={idx}>
                <span className="block text-[10px] text-[#9FB0C8]/70 uppercase">
                  {s.label}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#DCE6F5]">
                  {s.value}
                </span>
              </div>
            ))}
          </div>

          {/* Gallery Button */}
          <button
            type="button"
            onClick={() => onOpenGallery(hackathon)}
            className="btn-primary text-xs py-2.5 px-5"
          >
            <ImageIcon size={14} className="text-[#DCE6F5]" />
            <span>VIEW GALLERY & SPECS</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
