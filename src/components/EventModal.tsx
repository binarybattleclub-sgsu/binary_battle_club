import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Users, Award, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';

export interface ModalData {
  title: string;
  category?: string;
  date?: string;
  venue?: string;
  organizer?: string;
  description: string;
  highlights?: string[];
  gallery?: string[];
  award?: string;
  institution?: string;
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ModalData | null;
}

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, data }) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  useEffect(() => {
    setActivePhotoIdx(0);
  }, [data]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  const photos = data.gallery && data.gallery.length > 0 ? data.gallery : [];
  const currentPhoto = photos[activePhotoIdx] || '';

  const nextPhoto = () => {
    if (photos.length > 1) {
      setActivePhotoIdx((prev) => (prev + 1) % photos.length);
    }
  };

  const prevPhoto = () => {
    if (photos.length > 1) {
      setActivePhotoIdx((prev) => (prev - 1 + photos.length) % photos.length);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#080D18]/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-3xl bg-[#101D35] rounded-3xl shadow-[0_20px_60px_rgba(8,13,24,0.95)] border border-[#243650] overflow-hidden z-10 my-8 flex flex-col max-h-[90vh]">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#243650] bg-[#080D18]">
          <div className="flex items-center gap-2">
            {data.category && (
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase bg-[#2563EB]/15 text-[#38BDF8] border border-[#2563EB]/30">
                {data.category}
              </span>
            )}
            {data.award && (
              <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase bg-[#172945] text-[#DCE6F5] border border-[#243650] flex items-center gap-1">
                <Award size={13} className="text-[#38BDF8]" />
                {data.award}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#9FB0C8] hover:text-[#DCE6F5] hover:bg-[#172945] transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Main Photo Viewer */}
          {currentPhoto && (
            <div className="relative rounded-2xl overflow-hidden bg-[#080D18] border border-[#243650] shadow-inner aspect-video max-h-80 flex items-center justify-center">
              <img
                src={currentPhoto}
                alt={data.title}
                className="w-full h-full object-contain"
              />

              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#080D18]/85 hover:bg-[#172945] text-[#DCE6F5] flex items-center justify-center backdrop-blur-md transition-transform active:scale-95 border border-[#243650]"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={nextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#080D18]/85 hover:bg-[#172945] text-[#DCE6F5] flex items-center justify-center backdrop-blur-md transition-transform active:scale-95 border border-[#243650]"
                    aria-label="Next photo"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-[#080D18]/85 text-[#38BDF8] text-xs font-mono backdrop-blur-md border border-[#243650]">
                    {activePhotoIdx + 1} / {photos.length}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Gallery Thumbnails */}
          {photos.length > 1 && (
            <div>
              <p className="text-xs font-mono font-semibold text-[#9FB0C8] uppercase tracking-wider mb-2">
                EVENT_PHOTOGRAPHS_GALLERY
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {photos.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      activePhotoIdx === idx
                        ? 'border-[#38BDF8] ring-2 ring-[#38BDF8]/40 scale-105'
                        : 'border-[#243650] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Title and metadata */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#DCE6F5] mb-2 tracking-tight">
              {data.title}
            </h3>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#9FB0C8] font-mono">
              {data.date && (
                <div className="flex items-center gap-1.5">
                  <Calendar size={15} className="text-[#38BDF8]" />
                  <span>{data.date}</span>
                </div>
              )}
              {data.venue && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={15} className="text-[#38BDF8]" />
                  <span>{data.venue}</span>
                </div>
              )}
              {data.organizer && (
                <div className="flex items-center gap-1.5">
                  <Users size={15} className="text-[#38BDF8]" />
                  <span>{data.organizer}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="text-sm text-[#9FB0C8] leading-relaxed border-t border-[#243650] pt-4">
            <p>{data.description}</p>
          </div>

          {/* Key Highlights */}
          {data.highlights && data.highlights.length > 0 && (
            <div className="bg-[#080D18]/70 rounded-2xl p-4 border border-[#243650]">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8] mb-2.5">
                KEY_EVENT_HIGHLIGHTS
              </h4>
              <ul className="space-y-2">
                {data.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#DCE6F5]">
                    <CheckCircle2 size={16} className="text-[#38BDF8] shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-[#243650] bg-[#080D18] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary text-xs py-2 px-5"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
