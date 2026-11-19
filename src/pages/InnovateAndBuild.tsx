import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Rocket,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import {
  ProjectLabItem,
  StudentProfile,
  useProjectLabData,
  getFeaturedProjects,
} from '../data/projectLabData';
import { FeaturedProjectBanner } from '../components/project_lab/FeaturedProjectBanner';
import { StudentDirectory } from '../components/project_lab/StudentDirectory';
import { ProjectGrid } from '../components/project_lab/ProjectGrid';
import { StudentPortfolioView } from '../components/project_lab/StudentPortfolioView';
import { ProjectDetailModal } from '../components/project_lab/ProjectDetailModal';

export const InnovateAndBuild: React.FC = () => {
  const { studentId, projectId } = useParams<{ studentId?: string; projectId?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const basePath = location.pathname.startsWith('/create-showcase')
    ? '/create-showcase'
    : '/innovate-build';

  // Dynamic live-synced project lab data
  const {
    projects,
    students,
    isLoading,
    isRefreshing,
    lastUpdated,
    error,
    refreshData,
  } = useProjectLabData();

  // Active view states
  const [activeStudent, setActiveStudent] = useState<StudentProfile | null>(null);
  const [modalProject, setModalProject] = useState<ProjectLabItem | null>(null);

  // Sync active student with URL params
  useEffect(() => {
    if (studentId && students.length > 0) {
      const normalizedParam = studentId.toLowerCase().trim();
      const student = students.find(
        (s) =>
          s.id.toLowerCase() === normalizedParam ||
          s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === normalizedParam
      );
      if (student) {
        setActiveStudent(student);
      }
    } else if (!studentId) {
      setActiveStudent(null);
    }
  }, [studentId, students]);

  // Sync modal project with URL params
  useEffect(() => {
    if (projectId && projects.length > 0) {
      const normalizedParam = projectId.toLowerCase().trim();
      const project = projects.find(
        (p) => p.id.toLowerCase() === normalizedParam
      );
      if (project) {
        setModalProject(project);
      }
    }
  }, [projectId, projects]);

  const handleSelectStudent = (student: StudentProfile) => {
    setActiveStudent(student);
    navigate(`${basePath}/student/${student.id}`, { replace: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToProjectLab = () => {
    setActiveStudent(null);
    navigate(basePath, { replace: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProject = (project: ProjectLabItem) => {
    setModalProject(project);
  };

  const handleCloseModal = () => {
    setModalProject(null);
    if (projectId) {
      if (activeStudent) {
        navigate(`${basePath}/student/${activeStudent.id}`, { replace: true });
      } else {
        navigate(basePath, { replace: true });
      }
    }
  };

  // Get featured projects dynamically
  const featuredProjects = getFeaturedProjects(projects);

  return (
    <div className="space-y-10 text-[#DCE6F5] pb-16">
      {/* If viewing a dedicated Student Portfolio */}
      {activeStudent ? (
        <StudentPortfolioView
          student={activeStudent}
          allProjects={projects}
          allStudents={students}
          onBack={handleBackToProjectLab}
          onSelectProject={handleSelectProject}
          onSelectStudent={handleSelectStudent}
        />
      ) : (
        /* Main Project Lab Directory Experience */
        <div className="space-y-10">
          {/* SECTION A: HERO & INTRODUCTION */}
          <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#101D35]/95 via-[#101D35]/85 to-[#080D18] p-6 sm:p-8 md:p-10 border border-[#243650] shadow-[0_16px_45px_rgba(8,13,24,0.85)]">
            {/* Ambient Background Accents */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2563EB]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#2563EB]/15 text-[#38BDF8] border border-[#2563EB]/35 shadow-xs">
                  <Rocket size={14} className="text-[#38BDF8]" />
                  <span>THE PROJECT LAB // CREATE & SHOWCASE</span>
                </div>

                <div className="space-y-2.5">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#DCE6F5] tracking-tight leading-tight">
                    Student Innovation &{' '}
                    <span className="bg-gradient-to-r from-[#38BDF8] via-[#60A5FA] to-[#2563EB] bg-clip-text text-transparent">
                      Developer Directory
                    </span>
                  </h1>
                  <p className="text-sm sm:text-base text-[#9FB0C8] leading-relaxed max-w-3xl">
                    &ldquo;Collaborate across disciplines, exchange ideas and transform creative thinking into innovative prototypes, projects and real-world solutions.&rdquo;
                  </p>
                </div>
              </div>

              {/* Dynamic Live Google Sheet Sync Status Bar */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
                <div className="flex items-center gap-2.5 bg-[#080D18]/90 border border-[#243650] px-4 py-2 rounded-2xl shadow-md">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isRefreshing
                        ? 'bg-amber-400 animate-ping'
                        : error
                        ? 'bg-amber-500'
                        : 'bg-emerald-400 animate-pulse'
                    }`}
                  />
                  <div className="text-xs font-mono">
                    <span className="text-[#38BDF8] font-bold">
                      {isRefreshing ? 'Syncing...' : 'Live Google Sheet Sync'}
                    </span>
                    <span className="text-[#9FB0C8]/70 block text-[10px]">
                      {lastUpdated
                        ? `Auto-sync: 60s (Updated ${lastUpdated.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })})`
                        : 'Auto-sync active (60s)'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => refreshData()}
                    disabled={isRefreshing}
                    title="Force refresh from Google Sheet"
                    className="ml-2 p-1.5 rounded-lg bg-[#101D35] hover:bg-[#2563EB] border border-[#243650] hover:border-[#38BDF8] text-[#9FB0C8] hover:text-white transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw
                      size={13}
                      className={isRefreshing ? 'animate-spin text-[#38BDF8]' : ''}
                    />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-[#9FB0C8]">
                  <span className="px-2.5 py-1 rounded-xl bg-[#101D35] border border-[#243650]">
                    <strong className="text-[#38BDF8]">{projects.length}</strong> Projects
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-[#101D35] border border-[#243650]">
                    <strong className="text-[#38BDF8]">{students.length}</strong> Builders
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION B: LARGE CINEMATIC FEATURED PROJECTS BANNER SLIDESHOW */}
          <FeaturedProjectBanner
            projects={featuredProjects}
            students={students}
            onSelectProject={handleSelectProject}
            onSelectStudent={handleSelectStudent}
          />

          {/* SECTION C: MEET THE BUILDERS DIRECTORY */}
          <StudentDirectory
            students={students}
            projects={projects}
            onSelectStudent={handleSelectStudent}
          />

          {/* SECTION D: COMPLETE PROJECT ARCHIVE WITH SEARCH & FILTER */}
          <ProjectGrid
            projects={projects}
            students={students}
            onSelectProject={handleSelectProject}
            onSelectStudent={handleSelectStudent}
          />
        </div>
      )}

      {/* SECTION 7: PROJECT DETAIL MODAL */}
      <ProjectDetailModal
        project={modalProject}
        allStudents={students}
        onClose={handleCloseModal}
        onSelectStudent={handleSelectStudent}
      />
    </div>
  );
};
