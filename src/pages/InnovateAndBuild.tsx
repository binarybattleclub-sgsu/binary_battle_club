import React, { useState } from 'react';
import { Rocket, Filter, Sparkles } from 'lucide-react';
import { PROJECTS_DATA, StudentProject } from '../data/projects';
import { ProjectCard } from '../components/ProjectCard';

export const InnovateAndBuild: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'AI Projects',
    'Web Development',
    'Mobile Applications',
    'Cybersecurity',
    'Others',
  ];

  const filteredProjects =
    selectedCategory === 'All'
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-16 text-[#DCE6F5]">
      {/* Page Header */}
      <div className="bg-[#101D35]/85 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-[#243650] shadow-[0_12px_35px_rgba(8,13,24,0.8)]">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#2563EB]/15 text-[#38BDF8] border border-[#2563EB]/30 mb-3 shadow-[0_0_15px_rgba(37,99,235,0.15)]">
            <Rocket size={14} />
            <span>CREATE & SHOWCASE // SGSU</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#DCE6F5] tracking-tight mb-2.5">
            Create & Showcase
          </h1>
          <p className="text-xs sm:text-sm text-[#9FB0C8] leading-relaxed font-normal">
            &ldquo;Collaborate across disciplines, exchange ideas and transform creative thinking into innovative prototypes, projects and real-world solutions.&rdquo;
          </p>
        </div>
      </div>

      {/* Featured Projects Showcase */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#DCE6F5]">
              Student Innovation Gallery
            </h2>
            <p className="text-xs sm:text-sm text-[#9FB0C8] mt-1 font-mono">
              Working prototypes, open-source repositories, and digital systems built by club members.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <Filter size={15} className="text-[#9FB0C8] shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#2563EB] text-[#DCE6F5] shadow-[0_0_15px_rgba(37,99,235,0.3)] border border-[#38BDF8]/40'
                    : 'bg-[#101D35] text-[#9FB0C8] hover:text-[#DCE6F5] hover:bg-[#172945] border border-[#243650]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project: StudentProject) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
};
