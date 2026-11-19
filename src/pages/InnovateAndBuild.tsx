import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Rocket,
  Sparkles,
  Users,
} from 'lucide-react';
import {
  ProjectLabItem,
  StudentProfile,
  getProjectById,
  getStudentById,
} from '../data/projectLabData';
import { FeaturedProjectBanner } from '../components/project_lab/FeaturedProjectBanner';
import { StudentDirectory } from '../components/project_lab/StudentDirectory';
import { ProjectGrid } from '../components/project_lab/ProjectGrid';
import { StudentPortfolioView } from '../components/project_lab/StudentPortfolioView';
import { ProjectDetailModal } from '../components/project_lab/ProjectDetailModal';

export const InnovateAndBuild: React.FC = () => {
  const { studentId, projectId } = useParams<{ studentId?: string; projectId?: string }>();
  const navigate = useNavigate();

  // Active view states
  const [activeStudent, setActiveStudent] = useState<StudentProfile | null>(null);
  const [modalProject, setModalProject] = useState<ProjectLabItem | null>(null);

  // Sync state with URL params
  useEffect(() => {
    if (studentId) {
      const student = getStudentById(studentId);
      if (student) {
        setActiveStudent(student);
      }
    } else {
      setActiveStudent(null);
    }
  }, [studentId]);

  useEffect(() => {
    if (projectId) {
      const project = getProjectById(projectId);
      if (project) {
        setModalProject(project);
      }
    }
  }, [projectId]);

  const handleSelectStudent = (student: StudentProfile) => {
    setActiveStudent(student);
    navigate(`/innovate-build/student/${student.id}`, { replace: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToProjectLab = () => {
    setActiveStudent(null);
    navigate('/innovate-build', { replace: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProject = (project: ProjectLabItem) => {
    setModalProject(project);
  };

  const handleCloseModal = () => {
    setModalProject(null);
    if (projectId) {
      if (activeStudent) {
        navigate(`/innovate-build/student/${activeStudent.id}`, { replace: true });
      } else {
        navigate('/innovate-build', { replace: true });
      }
    }
  };

  return (
    <div className="space-y-10 text-[#DCE6F5] pb-16">
      {/* If viewing a dedicated Student Portfolio */}
      {activeStudent ? (
        <StudentPortfolioView
          student={activeStudent}
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

            <div className="relative max-w-4xl space-y-4">
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
          </section>

          {/* SECTION B: LARGE CINEMATIC FEATURED PROJECTS BANNER SLIDESHOW */}
          <FeaturedProjectBanner
            onSelectProject={handleSelectProject}
            onSelectStudent={handleSelectStudent}
          />

          {/* SECTION C: MEET THE BUILDERS DIRECTORY */}
          <StudentDirectory onSelectStudent={handleSelectStudent} />

          {/* SECTION D: COMPLETE PROJECT ARCHIVE WITH SEARCH & FILTER */}
          <ProjectGrid
            onSelectProject={handleSelectProject}
            onSelectStudent={handleSelectStudent}
          />
        </div>
      )}

      {/* SECTION 7: PROJECT DETAIL MODAL */}
      <ProjectDetailModal
        project={modalProject}
        onClose={handleCloseModal}
        onSelectStudent={handleSelectStudent}
      />
    </div>
  );
};
