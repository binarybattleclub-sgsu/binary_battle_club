import React, { useState, useEffect, useMemo } from 'react';
import { Cpu, Filter, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { EventModal, ModalData } from '../components/EventModal';
import {
  ExploreSharePoster,
  fetchExploreSharePosters,
} from '../services/exploreShareService';

export const ExploreTechnologies: React.FC = () => {
  const [posters, setPosters] = useState<ExploreSharePoster[]>([]);
  const [selectedTechCategory, setSelectedTechCategory] = useState<string>('All');
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // 1. Initial Load & Background Auto-Sync (Every 2.5 minutes)
  const loadPosters = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const data = await fetchExploreSharePosters();
      setPosters(data);
      const now = new Date();
      setLastSyncTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    } catch (err) {
      console.warn('[ExploreTechnologies] Error loading posters:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadPosters();

    // Auto-refresh interval (2.5 minutes)
    const interval = setInterval(() => {
      loadPosters();
    }, 150000);

    return () => clearInterval(interval);
  }, []);

  // 2. Dynamically extract categories from live published posters
  const techCategories = useMemo(() => {
    const defaultCats = [
      'Generative AI',
      'Artificial Intelligence',
      'Emerging Technologies',
      'Cybersecurity',
    ];
    const dynamicCats = new Set<string>();

    posters.forEach((p) => {
      if (p.category && p.category.trim() !== '') {
        dynamicCats.add(p.category.trim());
      }
    });

    // Merge default categories with any new category subfolders from Google Drive
    defaultCats.forEach((c) => dynamicCats.add(c));

    return ['All', ...Array.from(dynamicCats)];
  }, [posters]);

  // 3. Filter posters by selected category
  const filteredUpdates = useMemo(() => {
    if (selectedTechCategory === 'All') {
      return posters;
    }
    return posters.filter(
      (item) => item.category?.toLowerCase() === selectedTechCategory.toLowerCase()
    );
  }, [posters, selectedTechCategory]);

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
        <div className="bg-gradient-to-r from-[#101D35] via-[#13223d] to-[#101D35] text-[#DCE6F5] rounded-3xl p-8 sm:p-10 border border-[#243650] shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="max-w-3xl">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#2563EB]/15 text-[#38BDF8] border border-[#2563EB]/30 inline-flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#38BDF8]" />
              TECH_INTELLIGENCE // RESEARCH
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-3 mb-2 tracking-tight">
              Technology & AI Updates
            </h2>
            <p className="text-xs sm:text-sm text-[#9FB0C8] leading-relaxed font-normal">
              Curated breakthroughs, research directions, and practical developer tools in emerging tech.
            </p>
          </div>

          {/* Sync indicator */}
          <div className="flex items-center gap-2.5 text-xs font-mono text-[#9FB0C8] self-start sm:self-center shrink-0 bg-[#080D18]/60 px-3.5 py-1.5 rounded-full border border-[#243650]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Drive Sync</span>
            {lastSyncTime && <span className="text-[#9FB0C8]/60">• {lastSyncTime}</span>}
            <button
              type="button"
              onClick={() => loadPosters(true)}
              disabled={isRefreshing}
              title="Refresh gallery from Google Drive"
              className="hover:text-[#38BDF8] transition-colors ml-1"
            >
              <RefreshCw size={12} className={isRefreshing ? 'animate-spin text-[#38BDF8]' : ''} />
            </button>
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
                selectedTechCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-[#2563EB] text-[#DCE6F5] shadow-[0_0_15px_rgba(37,99,235,0.3)] border border-[#38BDF8]/40'
                  : 'bg-[#101D35] text-[#9FB0C8] hover:text-[#DCE6F5] hover:bg-[#172945] border border-[#243650]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="bg-[#101D35]/60 backdrop-blur-xl rounded-3xl border border-[#243650] p-4 flex flex-col items-center justify-center animate-pulse min-h-[380px]"
              >
                <div className="w-full h-[320px] bg-[#172945]/70 rounded-2xl mb-3"></div>
                <div className="w-3/4 h-4 bg-[#172945] rounded-full self-start mb-2"></div>
                <div className="w-1/2 h-3 bg-[#172945]/50 rounded-full self-start"></div>
              </div>
            ))}
          </div>
        ) : filteredUpdates.length === 0 ? (
          /* Empty state for filtered category */
          <div className="bg-[#101D35]/50 border border-[#243650] rounded-3xl p-12 text-center text-[#9FB0C8]">
            <AlertCircle size={32} className="mx-auto mb-3 text-[#38BDF8]" />
            <h3 className="text-base font-bold text-[#DCE6F5] mb-1">
              No posters found in {selectedTechCategory}
            </h3>
            <p className="text-xs">
              Upload an image into Google Drive under <code className="text-[#38BDF8]">Published/{selectedTechCategory}</code> to publish it here.
            </p>
          </div>
        ) : (
          /* Content Cards Grid (3-column layout matching exact design) */
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
                    organizer: item.author || 'Binary Battle Club',
                    highlights: [
                      `Published via BBC Google Drive CMS (${item.category})`,
                      item.author ? `Curated by: ${item.author}` : `Official Binary Battle Club Briefing`,
                      item.sourceUrl ? `Source: ${item.sourceUrl}` : `Binary Battle Club Research`,
                    ],
                    gallery: [item.image],
                  })
                }
                className="bg-[#101D35]/85 backdrop-blur-xl rounded-3xl border border-[#243650] shadow-lg hover:shadow-[0_12px_35px_rgba(8,13,24,0.8),0_0_20px_rgba(37,99,235,0.18)] hover:border-[#38BDF8]/40 hover:bg-[#172945]/90 transition-all duration-300 overflow-hidden group cursor-pointer p-3 sm:p-4 flex flex-col items-center justify-center relative"
              >
                {/* Featured badge if enabled in Google Sheets */}
                {item.featured && (
                  <div className="absolute top-5 right-5 z-10 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#2563EB]/80 text-[#DCE6F5] backdrop-blur-md border border-[#38BDF8]/40 shadow-[0_0_12px_rgba(37,99,235,0.5)]">
                    Featured
                  </div>
                )}

                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('/images/technology_updates/')) {
                      target.src = '/images/technology_updates/tech_update_1_uniform.jpg';
                    }
                  }}
                  className="w-full h-auto object-contain rounded-2xl group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        )}
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
