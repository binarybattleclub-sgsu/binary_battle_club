import React from 'react';
import { ArrowLeft, Mail, FolderGit2, Users, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from '../SocialIcons';
import { StudentProfile, ProjectLabItem, getProjectsForStudent, getStudentById } from '../../data/projectLabData';
import { ProjectLabCard } from './ProjectLabCard';

interface StudentPortfolioViewProps {
  student: StudentProfile;
  onBack: () => void;
  onSelectProject: (project: ProjectLabItem) => void;
  onSelectStudent: (student: StudentProfile) => void;
}

export const StudentPortfolioView: React.FC<StudentPortfolioViewProps> = ({
  student,
  onBack,
  onSelectProject,
  onSelectStudent,
}) => {
  const projects = getProjectsForStudent(student.id);
  const collaborativeProjects = projects.filter((p) => p.isCollaborative);

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* Navigation Top Bar */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#101D35] hover:bg-[#172945] border border-[#243650] hover:border-[#38BDF8] text-[#DCE6F5] text-xs font-mono font-semibold transition-all group shadow-sm"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Project Lab</span>
        </button>
      </div>

      {/* Developer Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#101D35] via-[#101D35]/95 to-[#172945] border border-[#243650] p-6 sm:p-10 shadow-[0_20px_50px_rgba(8,13,24,0.9)]">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            {/* Large Avatar */}
            <div className="relative shrink-0">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-[#101D35] via-[#172945] to-[#2563EB]/50 border-2 border-[#38BDF8]/60 flex items-center justify-center text-[#DCE6F5] font-mono font-extrabold text-2xl sm:text-3xl shadow-xl">
                {student.avatarInitials}
              </div>
              <span
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#101D35] shadow-xs"
                title="Active Builder"
              />
            </div>

            {/* Profile Info */}
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/30 text-[#38BDF8] text-[11px] font-mono mb-2">
                <Sparkles size={11} />
                <span>VERIFIED STUDENT DEVELOPER</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#DCE6F5] tracking-tight">
                {student.name}
              </h1>
              <p className="text-sm sm:text-base text-[#9FB0C8] mt-1 max-w-xl">
                {student.tagline}
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-[#9FB0C8]/70 mt-2">
                <Mail size={12} className="text-[#38BDF8]" />
                <span>{student.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Pills */}
          <div className="flex flex-row md:flex-col gap-3 shrink-0">
            <div className="bg-[#080D18]/90 border border-[#243650] rounded-2xl px-4 py-3 min-w-[130px]">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#9FB0C8]">
                Showcase Projects
              </div>
              <div className="text-2xl font-mono font-bold text-[#38BDF8]">
                {projects.length}
              </div>
            </div>

            {collaborativeProjects.length > 0 && (
              <div className="bg-[#080D18]/90 border border-[#243650] rounded-2xl px-4 py-3 min-w-[130px]">
                <div className="text-[11px] font-mono uppercase tracking-wider text-purple-300">
                  Collaborations
                </div>
                <div className="text-2xl font-mono font-bold text-purple-400">
                  {collaborativeProjects.length}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Projects Showcase Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#243650] pb-4">
          <div className="flex items-center gap-2">
            <FolderGit2 size={18} className="text-[#38BDF8]" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#DCE6F5]">
              Projects by {student.name}
            </h2>
          </div>
          <span className="text-xs font-mono text-[#9FB0C8]">
            {projects.length} {projects.length === 1 ? 'Project' : 'Projects'} in Directory
          </span>
        </div>

        {/* Collaboration Notice if SpendWise is in this student's projects */}
        {collaborativeProjects.length > 0 && (
          <div className="p-4 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Users size={18} className="text-[#38BDF8] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8]">
                  Collaborative Engineering
                </h4>
                <p className="text-xs text-[#DCE6F5]/90 mt-0.5">
                  {student.name} co-engineered projects with club peers. Explore collaborative partners directly through project details.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectLabCard
              key={project.id}
              project={project}
              onSelectProject={onSelectProject}
              onSelectStudent={onSelectStudent}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
