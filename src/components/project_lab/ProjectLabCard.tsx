import React from 'react';
import { ExternalLink, Users, Sparkles, Eye, ArrowUpRight, Smartphone } from 'lucide-react';
import { GithubIcon } from '../SocialIcons';
import {
  ProjectLabItem,
  StudentProfile,
  getStudentById,
} from '../../data/projectLabData';
import { ProjectThumbnail } from './ProjectThumbnail';

interface ProjectLabCardProps {
  project: ProjectLabItem;
  allStudents?: StudentProfile[];
  onSelectProject: (project: ProjectLabItem) => void;
  onSelectStudent?: (student: StudentProfile) => void;
}

export const ProjectLabCard: React.FC<ProjectLabCardProps> = ({
  project,
  allStudents,
  onSelectProject,
  onSelectStudent,
}) => {
  const hasLiveDemo = Boolean(
    project.workingUrl &&
      project.workingUrl !== '#' &&
      project.workingUrl.startsWith('http') &&
      project.isValidWebUrl !== false
  );
  const hasGithub = Boolean(
    project.githubUrl &&
      project.githubUrl !== '#' &&
      project.githubUrl.startsWith('http')
  );
  const hasSecondary = Boolean(
    project.secondaryUrl &&
      project.secondaryUrl !== '#' &&
      project.secondaryUrl.startsWith('http')
  );

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'ai projects':
        return 'bg-[#2563EB]/20 text-[#38BDF8] border-[#2563EB]/40';
      case 'cybersecurity':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'web development':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      default:
        return 'bg-[#243650] text-[#DCE6F5] border-[#243650]';
    }
  };

  const resolveStudent = (studentId: string, name: string): StudentProfile | undefined => {
    if (allStudents && allStudents.length > 0) {
      const match = allStudents.find(
        (s) => s.id === studentId || s.name.toLowerCase() === name.toLowerCase()
      );
      if (match) return match;
    }
    return getStudentById(studentId);
  };

  return (
    <div className="group relative rounded-3xl overflow-hidden bg-[#101D35]/85 backdrop-blur-xl border border-[#243650] hover:border-[#38BDF8]/60 hover:bg-[#172945]/90 shadow-[0_12px_35px_rgba(8,13,24,0.8)] hover:shadow-[0_16px_40px_rgba(8,13,24,0.95),0_0_25px_rgba(37,99,235,0.2)] transition-all duration-300 flex flex-col justify-between">
      {/* Top Media & Tags */}
      <div>
        <div
          onClick={() => onSelectProject(project)}
          className="relative aspect-[16/10] overflow-hidden bg-[#080D18] cursor-pointer"
        >
          <ProjectThumbnail
            project={project}
            aspectRatio="aspect-[16/10]"
            imageClassName="group-hover:scale-105"
          />

          {/* Floating Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border shadow-md backdrop-blur-md ${getCategoryColor(
                project.category
              )}`}
            >
              {project.category}
            </span>

            {project.isCollaborative && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-md backdrop-blur-md flex items-center gap-1">
                <Users size={10} />
                <span>Collaborative</span>
              </span>
            )}
          </div>

          {/* Quick Preview Hover Indicator */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
            <span className="px-3.5 py-1.5 rounded-xl bg-[#080D18]/90 border border-[#38BDF8]/60 text-[#38BDF8] text-xs font-mono font-semibold flex items-center gap-1.5 shadow-xl backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-transform">
              <Eye size={13} />
              Quick View
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          <h3
            onClick={() => onSelectProject(project)}
            className="text-lg sm:text-xl font-bold text-[#DCE6F5] hover:text-[#38BDF8] transition-colors cursor-pointer leading-snug mb-2 flex items-start justify-between gap-2"
          >
            <span className="line-clamp-2">{project.title}</span>
            <ArrowUpRight
              size={18}
              className="text-[#9FB0C8]/60 group-hover:text-[#38BDF8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 mt-0.5"
            />
          </h3>

          <p className="text-xs sm:text-sm text-[#9FB0C8] line-clamp-2 leading-relaxed mb-4">
            {project.tagline || project.description}
          </p>

          {/* Contributors Attribution */}
          <div className="pt-3 border-t border-[#243650]/60">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#9FB0C8]/70 mb-2 flex items-center gap-1">
              <Users size={11} className="text-[#38BDF8]" />
              <span>{project.isCollaborative ? 'Collaborators' : 'Lead Builder'}</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {project.contributors.map((name, idx) => {
                const studentId = project.contributorIds[idx];
                const studentProfile = resolveStudent(studentId, name);

                return (
                  <button
                    key={name}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (studentProfile && onSelectStudent) {
                        onSelectStudent(studentProfile);
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      studentProfile && onSelectStudent
                        ? 'bg-[#080D18]/90 text-[#DCE6F5] border-[#243650] hover:border-[#38BDF8] hover:text-[#38BDF8]'
                        : 'bg-[#080D18]/60 text-[#9FB0C8] border-[#243650]/40'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                    <span>{name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Card Actions */}
      <div className="p-6 pt-0 mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onSelectProject(project)}
          className="flex-1 py-2.5 px-3 rounded-xl bg-[#2563EB]/15 hover:bg-[#2563EB]/30 border border-[#2563EB]/40 hover:border-[#38BDF8] text-[#38BDF8] hover:text-white font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <Eye size={13} />
          <span>View Details</span>
        </button>

        {hasLiveDemo && (
          <a
            href={project.workingUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open Live Deployment"
            className="p-2.5 rounded-xl bg-[#080D18] hover:bg-[#2563EB] border border-[#243650] hover:border-[#38BDF8] text-[#9FB0C8] hover:text-white transition-all flex items-center justify-center shadow-xs"
          >
            <ExternalLink size={15} />
          </a>
        )}

        {hasSecondary && (
          <a
            href={project.secondaryUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={project.secondaryUrlLabel || 'Mobile App / Alternate Link'}
            className="p-2.5 rounded-xl bg-[#080D18] hover:bg-[#2563EB] border border-[#243650] hover:border-[#38BDF8] text-[#9FB0C8] hover:text-white transition-all flex items-center justify-center shadow-xs"
          >
            <Smartphone size={15} />
          </a>
        )}

        {hasGithub && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="View Source Repository"
            className="p-2.5 rounded-xl bg-[#080D18] hover:bg-[#2563EB] border border-[#243650] hover:border-[#38BDF8] text-[#9FB0C8] hover:text-white transition-all flex items-center justify-center shadow-xs"
          >
            <GithubIcon size={15} />
          </a>
        )}
      </div>
    </div>
  );
};
