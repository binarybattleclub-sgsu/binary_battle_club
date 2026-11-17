import React, { useState } from 'react';
import { Cpu, Filter } from 'lucide-react';
import { ASSETS } from '../data/assets';
import { TECH_UPDATES_DATA } from '../data/technologyUpdates';
import { EventModal, ModalData } from '../components/EventModal';

export const ExploreTechnologies: React.FC = () => {
  const [selectedTechCategory, setSelectedTechCategory] = useState<string>('All');
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const techCategories = [
    'All',
    'Generative AI',
    'Artificial Intelligence',
    'Emerging Technologies',
  ];

  const filteredUpdates =
    selectedTechCategory === 'All'
      ? TECH_UPDATES_DATA
      : TECH_UPDATES_DATA.filter((item) => item.category === selectedTechCategory);

  return (
    <div className="space-y-16 text-[#DCE6F5]">
      {/* Page Header */}
      <div className="bg-[#101D35]/85 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-[#243650] shadow-[0_12px_35px_rgba(8,13,24,0.8)]">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#2563EB]/15 text-[#38BDF8] border border-[#2563EB]/30 mb-3 shadow-[0_0_15px_rgba(37,99,235,0.15)]">
            <Cpu size={14} />
            <span>EXPLORE & SHARE // SGSU</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#DCE6F5] tracking-tight mb-2.5">
            Explore & Share
          </h1>
          <p className="text-xs sm:text-sm text-[#9FB0C8] leading-relaxed font-normal">
            Stay ahead with the latest advancements in Artificial Intelligence, hands-on Friday laboratory workshops, interactive coding challenges, and peer-to-peer tutorial resources.
          </p>
        </div>
      </div>

      {/* A. Latest Technology & AI Updates */}
      <section className="space-y-6">
        <div className="bg-gradient-to-r from-[#101D35] via-[#13223d] to-[#101D35] text-[#DCE6F5] rounded-3xl p-8 sm:p-10 border border-[#243650] shadow-xl relative overflow-hidden">
          <div className="max-w-3xl">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#2563EB]/15 text-[#38BDF8] border border-[#2563EB]/30">
              TECH_INTELLIGENCE // RESEARCH
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-3 mb-2 tracking-tight">
              Technology & AI Updates
            </h2>
            <p className="text-xs sm:text-sm text-[#9FB0C8] leading-relaxed font-normal">
              Curated breakthroughs, research directions, and practical developer tools in emerging tech.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter size={15} className="text-[#9FB0C8] shrink-0 ml-1" />
          {techCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedTechCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                selectedTechCategory === cat
                  ? 'bg-[#2563EB] text-[#DCE6F5] shadow-[0_0_15px_rgba(37,99,235,0.3)] border border-[#38BDF8]/40'
                  : 'bg-[#101D35] text-[#9FB0C8] hover:text-[#DCE6F5] hover:bg-[#172945] border border-[#243650]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUpdates.map((item) => (
            <div
              key={item.id}
              onClick={() =>
                setModalData({
                  title: item.title,
                  category: item.category,
                  date: item.date,
                  description: item.description,
                  highlights: [
                    `Published under Binary Battle Club Technology Briefing`,
                    `Relevant category: ${item.category}`,
                    `Estimated reading & comprehension time: ${item.readTime}`,
                  ],
                  gallery:
                    item.id === 'update-1'
                      ? [item.image, ASSETS.technologyUpdates.aiUpdatesOriginal]
                      : item.id === 'update-2'
                      ? [item.image, ASSETS.technologyUpdates.tutorialsSharingOriginal]
                      : [item.image, ASSETS.technologyUpdates.ragSystemOriginal],
                })
              }
              className="bg-[#101D35]/85 backdrop-blur-xl rounded-3xl border border-[#243650] shadow-lg hover:shadow-[0_12px_35px_rgba(8,13,24,0.8),0_0_20px_rgba(37,99,235,0.18)] hover:border-[#38BDF8]/40 hover:bg-[#172945]/90 transition-all duration-300 overflow-hidden group cursor-pointer p-3 sm:p-4 flex flex-col items-center justify-center"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-auto object-contain rounded-2xl group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Details modal */}
      <EventModal
        isOpen={Boolean(modalData)}
        onClose={() => setModalData(null)}
        data={modalData}
      />
    </div>
  );
};
