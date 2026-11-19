import React from 'react';
import { ArrowRight, FolderGit2 } from 'lucide-react';
import {
  StudentProfile,
  ProjectLabItem,
  getProjectsForStudent,
} from '../../data/projectLabData';
import { ProjectThumbnail } from './ProjectThumbnail';

interface StudentProfileCardProps {
  student: StudentProfile;
  projects?: ProjectLabItem[];
  onSelectStudent: (student: StudentProfile) => void;
}

export const StudentProfileCard: React.FC<StudentProfileCardProps> = ({
  student,
  projects,
  onSelectStudent,
}) => {
  const studentProjects = projects
    ? projects.filter(
        (p) =>
          student.projectIds.includes(p.id) ||
          p.contributorIds.includes(student.id) ||
          p.contributors.some(
            (c) => c.toLowerCase() === student.name.toLowerCase()
          )
      )
    : getProjectsForStudent(student.id);

  const projectCount = studentProjects.length;

  return (
    <div
      onClick={() => onSelectStudent(student)}
      className="group relative rounded-3xl overflow-hidden bg-[#101D35]/85 backdrop-blur-xl border border-[#243650] hover:border-[#38BDF8]/60 hover:bg-[#172945]/90 shadow-[0_12px_35px_rgba(8,13,24,0.8)] hover:shadow-[0_16px_40px_rgba(8,13,24,0.95),0_0_25px_rgba(37,99,235,0.2)] transition-all duration-300 flex flex-col justify-between p-6 cursor-pointer"
    >
      <div>
        {/* Header: Initial Avatar & Project Count Pill */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="relative">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#101D35] via-[#172945] to-[#2563EB]/40 border-2 border-[#2563EB]/40 group-hover:border-[#38BDF8] flex items-center justify-center text-[#DCE6F5] font-mono font-extrabold text-base sm:text-lg shadow-md transition-colors">
              {student.avatarInitials}
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#101D35]" />
          </div>

          <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#2563EB]/15 text-[#38BDF8] border border-[#2563EB]/30 shadow-xs">
            {projectCount} {projectCount === 1 ? 'Project' : 'Projects'}
          </span>
        </div>

        {/* Student Name & Verified Tagline */}
        <div className="space-y-1 mb-5">
          <h3 className="text-base sm:text-lg font-bold text-[#DCE6F5] group-hover:text-[#38BDF8] transition-colors leading-snug">
            {student.name}
          </h3>
          <p className="text-xs text-[#9FB0C8] font-normal leading-relaxed line-clamp-2">
            {student.tagline}
          </p>
        </div>

        {/* Thumbnail Preview Strip */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <FolderGit2 size={12} className="text-[#38BDF8]" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#9FB0C8]/70">
              Showcase Portfolio
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {studentProjects.slice(0, 2).map((proj) => (
              <div
                key={proj.id}
                className="relative aspect-video rounded-xl overflow-hidden bg-[#080D18] border border-[#243650] group-hover:border-[#38BDF8]/40 transition-colors"
              >
                <ProjectThumbnail
                  project={proj}
                  aspectRatio="aspect-video"
                  imageClassName="group-hover:scale-105"
                />
                <span className="absolute bottom-1.5 left-1.5 right-1.5 text-[9px] font-mono text-[#DCE6F5] truncate leading-tight z-10 drop-shadow">
                  {proj.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Card Action Link */}
      <div className="pt-4 border-t border-[#243650]/60 flex items-center justify-between text-xs font-semibold text-[#38BDF8]">
        <span className="font-mono text-[11px] group-hover:underline">
          Explore Portfolio
        </span>
        <div className="w-7 h-7 rounded-lg bg-[#080D18] border border-[#243650] group-hover:border-[#38BDF8] group-hover:bg-[#2563EB] group-hover:text-white flex items-center justify-center transition-all duration-300">
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </div>
  );
};
