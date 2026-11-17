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
    <div className="space-y-16 text-[#DCE6F5]">
      {/* Page Header */}
      <div className="bg-[#101D35]/85 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-[#243650] shadow-[0_12px_35px_rgba(8,13,24,0.8)]">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#2563EB]/15 text-[#38BDF8] border border-[#2563EB]/30 mb-3 shadow-[0_0_15px_rgba(37,99,235,0.15)]">
            <Flame size={14} />
            <span>SPRINT_ARENAS // EVENTS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#DCE6F5] tracking-tight mb-2.5">
            Events & Hackathons
          </h1>
          <p className="text-xs sm:text-sm text-[#9FB0C8] leading-relaxed font-normal">
            &ldquo;Where ideas meet challenges and innovation comes to life.&rdquo;
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
