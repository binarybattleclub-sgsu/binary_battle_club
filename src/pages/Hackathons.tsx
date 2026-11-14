import React, { useState } from 'react';
import { Flame } from 'lucide-react';
import { HACKATHONS_DATA, HackathonEvent } from '../data/hackathons';
import { HackathonCard } from '../components/HackathonCard';
import { EventModal, ModalData } from '../components/EventModal';

export const Hackathons: React.FC = () => {
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const handleOpenHackathonGallery = (hackathon: HackathonEvent) => {
    setModalData({
      title: hackathon.title,
      category: hackathon.duration,
      date: hackathon.date || hackathon.status,
      venue: hackathon.venue,
      description: hackathon.fullDescription,
      highlights: hackathon.highlights,
      gallery: hackathon.gallery,
    });
  };

  return (
    <div className="space-y-16">
      {/* Page Header */}
      <div className="bg-[#0a0f1e]/85 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30 mb-3 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Flame size={14} />
            <span>SPRINT_ARENAS // EVENTS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2.5">
            Events & Hackathons
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
            "Where ideas meet challenges and innovation comes to life."
          </p>
        </div>
      </div>

      {/* Featured Hackathon Cards */}
      <section className="space-y-8">
        {HACKATHONS_DATA.map((hackathon) => (
          <HackathonCard
            key={hackathon.id}
            hackathon={hackathon}
            onOpenGallery={handleOpenHackathonGallery}
          />
        ))}
      </section>

      {/* Modal */}
      <EventModal
        isOpen={Boolean(modalData)}
        onClose={() => setModalData(null)}
        data={modalData}
      />
    </div>
  );
};
