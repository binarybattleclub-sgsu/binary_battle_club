import React, { useState, useMemo } from 'react';
import { Search, Filter, X, Sparkles, FolderGit2, Users } from 'lucide-react';
import {
  ProjectLabItem,
  StudentProfile,
  getAllProjects,
  getAllStudents,
} from '../../data/projectLabData';
import { ProjectLabCard } from './ProjectLabCard';

interface ProjectGridProps {
  projects?: ProjectLabItem[];
  students?: StudentProfile[];
  onSelectProject: (project: ProjectLabItem) => void;
  onSelectStudent: (student: StudentProfile) => void;
  initialCategory?: string;
  initialContributor?: string;
}

export const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  students,
  onSelectProject,
  onSelectStudent,
  initialCategory = 'All',
  initialContributor = 'All',
}) => {
  const allProjects = useMemo(() => projects || getAllProjects(), [projects]);
  const allStudents = useMemo(() => students || getAllStudents(), [students]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedContributor, setSelectedContributor] = useState(initialContributor);

  const categories = useMemo(() => {
    return ['All', 'AI Projects', 'Web Development', 'Cybersecurity'];
  }, []);

  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => {
      // Category filter
      if (selectedCategory !== 'All' && project.category !== selectedCategory) {
        return false;
      }

      // Contributor filter
      if (selectedContributor !== 'All') {
        const matchesStudent =
          project.contributorIds.includes(selectedContributor) ||
          project.contributors.some(
            (c) =>
              c.toLowerCase() === selectedContributor.toLowerCase() ||
              c
                .toLowerCase()
                .replace(/\s+/g, '-') === selectedContributor.toLowerCase()
          );
        if (!matchesStudent) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = project.title.toLowerCase().includes(q);
        const matchesTagline = project.tagline.toLowerCase().includes(q);
        const matchesDesc = project.description.toLowerCase().includes(q);
        const matchesContributor = project.contributors.some((c) =>
          c.toLowerCase().includes(q)
        );
        const matchesCategory = project.category.toLowerCase().includes(q);

        if (
          !matchesTitle &&
          !matchesTagline &&
          !matchesDesc &&
          !matchesContributor &&
          !matchesCategory
        ) {
          return false;
        }
      }

      return true;
    });
  }, [allProjects, selectedCategory, selectedContributor, searchQuery]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedContributor('All');
  };

  return (
    <section id="project-archive" className="relative py-12 md:py-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/30 text-[#38BDF8] text-xs font-mono mb-3">
            <FolderGit2 size={13} />
            <span>PROJECT ARCHIVE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#DCE6F5] tracking-tight">
            Explore All <span className="bg-gradient-to-r from-[#38BDF8] to-[#2563EB] bg-clip-text text-transparent">Innovations</span>
          </h2>
          <p className="text-sm md:text-base text-[#9FB0C8] mt-2 max-w-2xl">
            Browse verified student projects across AI engineering, web tools, machine learning, and security. Search by keywords or filter by domain and student author.
          </p>
        </div>

        <div className="text-xs font-mono text-[#9FB0C8] bg-[#101D35] px-3.5 py-1.5 rounded-xl border border-[#243650] self-start md:self-auto">
          Showing <span className="text-[#38BDF8] font-bold">{filteredProjects.length}</span> of {allProjects.length} Projects
        </div>
      </div>

      {/* Control Bar: Search + Category Pills + Contributor Filter */}
      <div className="bg-[#101D35]/80 backdrop-blur-xl border border-[#243650] rounded-2xl p-4 sm:p-5 mb-8 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9FB0C8]/70"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by name, technology, or student builder..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#080D18] border border-[#243650] focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] text-sm text-[#DCE6F5] placeholder-[#9FB0C8]/50 outline-none transition-all font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9FB0C8] hover:text-[#DCE6F5] transition-colors cursor-pointer"
                title="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Contributor Dropdown */}
          <div className="relative min-w-[200px]">
            <select
              value={selectedContributor}
              onChange={(e) => setSelectedContributor(e.target.value)}
              className="w-full py-2.5 px-3.5 rounded-xl bg-[#080D18] border border-[#243650] focus:border-[#38BDF8] text-sm text-[#DCE6F5] outline-none transition-all cursor-pointer font-sans"
            >
              <option value="All">All Contributors ({allStudents.length})</option>
              {allStudents.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#243650]/60">
          <span className="text-[11px] font-mono text-[#9FB0C8]/70 uppercase tracking-wider mr-1 hidden sm:inline">
            Category:
          </span>
          {categories.map((cat) => {
            const count =
              cat === 'All'
                ? allProjects.length
                : allProjects.filter((p) => p.category === cat).length;
            const isActive = selectedCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-[#2563EB] text-white border border-[#38BDF8] shadow-md shadow-[#2563EB]/25'
                    : 'bg-[#080D18] text-[#9FB0C8] border border-[#243650] hover:border-[#38BDF8]/40 hover:text-[#DCE6F5]'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#101D35] text-[#9FB0C8]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}

          {(selectedCategory !== 'All' || selectedContributor !== 'All' || searchQuery) && (
            <button
              type="button"
              onClick={resetFilters}
              className="ml-auto text-xs font-mono text-[#38BDF8] hover:underline flex items-center gap-1 py-1 cursor-pointer"
            >
              <X size={12} />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid or Empty State */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectLabCard
              key={project.id}
              project={project}
              allStudents={allStudents}
              onSelectProject={onSelectProject}
              onSelectStudent={onSelectStudent}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-[#101D35]/50 border border-[#243650] p-12 text-center max-w-xl mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-[#080D18] border border-[#243650] flex items-center justify-center mx-auto mb-4 text-[#9FB0C8]">
            <Search size={24} />
          </div>
          <h3 className="text-lg font-bold text-[#DCE6F5] mb-2">No Matching Projects Found</h3>
          <p className="text-sm text-[#9FB0C8] mb-6">
            We couldn't find any projects matching your search criteria. Try modifying your search keywords or resetting active filters.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-xs font-mono font-semibold transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </section>
  );
};
