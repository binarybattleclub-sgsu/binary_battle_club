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
      className={`bg-[#0a0f1e]/90 backdrop-blur-xl rounded-3xl border transition-all duration-300 overflow-hidden shadow-xl flex flex-col lg:flex-row ${
        isUpcoming
          ? 'border-indigo-500/60 shadow-[0_0_40px_rgba(99,102,241,0.25)] ring-1 ring-cyan-500/30'
          : 'border-white/10 hover:border-indigo-500/40 hover:shadow-[0_0_35px_rgba(99,102,241,0.2)]'
      }`}
    >
      {/* Event Cover Photo */}
      <div className="relative lg:w-5/12 aspect-video lg:aspect-auto overflow-hidden bg-slate-950 shrink-0">
        <img
          src={hackathon.coverImage}
          alt={hackathon.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 opacity-90 hover:opacity-100"
        />

        {/* Status Badge */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {isUpcoming ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/30">
              <Sparkles size={13} className="animate-spin text-cyan-200" />
              UPCOMING_SPRINT
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg">
              <Award size={13} />
              FLAGSHIP_SPRINT
            </span>
          )}

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-slate-950/80 text-cyan-300 backdrop-blur-md border border-cyan-500/30">
            <Clock size={12} />
            {hackathon.duration}
          </span>
        </div>

        {/* Gallery count tag */}
        <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-lg bg-slate-950/80 text-slate-300 text-xs font-mono backdrop-blur-md border border-white/10 flex items-center gap-1.5">
          <ImageIcon size={13} className="text-cyan-400" />
          <span>{hackathon.gallery.length} PHOTOS</span>
        </div>
      </div>

      {/* Content & Details */}
      <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
        <div>
          {/* Header & Title */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {hackathon.title}
            </h3>
          </div>

          {/* Venue & Date */}
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400 font-mono mb-4">
            <div className="flex items-center gap-1.5">
              <MapPin size={15} className="text-cyan-400 shrink-0" />
              <span>{hackathon.venue}</span>
            </div>
            {hackathon.date && (
              <div className="flex items-center gap-1.5">
                <Calendar size={15} className="text-indigo-400 shrink-0" />
                <span>{hackathon.date}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
            {hackathon.shortDescription}
          </p>

          {/* Highlights */}
          <div className="mb-6">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2.5">
              SPRINT_HIGHLIGHTS:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {hackathon.highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action and Stats Strip */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          {/* Mini Stats */}
          <div className="flex items-center gap-4 sm:gap-6 font-mono">
            {hackathon.stats.slice(0, 2).map((s, idx) => (
              <div key={idx}>
                <span className="block text-[10px] text-slate-500 uppercase">
                  {s.label}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-200">
                  {s.value}
                </span>
              </div>
            ))}
          </div>

          {/* Gallery Button */}
          <button
            type="button"
            onClick={() => onOpenGallery(hackathon)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.35)] group/btn"
          >
            <ImageIcon size={15} className="text-cyan-300" />
            <span>VIEW GALLERY & SPECS</span>
            <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
