import React, { useEffect } from 'react';
import { X, ExternalLink, Users, Calendar, ArrowRight, Sparkles, CheckCircle2, Info } from 'lucide-react';
import { GithubIcon } from '../SocialIcons';
import { ProjectLabItem, StudentProfile, getStudentById } from '../../data/projectLabData';

interface ProjectDetailModalProps {
  project: ProjectLabItem | null;
  onClose: () => void;
  onSelectStudent?: (student: StudentProfile) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onSelectStudent,
}) => {
  // ESC key listener & body scroll lock
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [project, onClose]);

  if (!project) return null;

  const hasLiveDemo = project.workingUrl && project.workingUrl !== '#' && project.workingUrl.startsWith('http');
  const hasGithub = project.githubUrl && project.githubUrl !== '#' && project.githubUrl.startsWith('http');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#080D18]/85 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#101D35] border border-[#243650] shadow-[0_25px_60px_rgba(8,13,24,0.95),0_0_35px_rgba(37,99,235,0.15)] overflow-hidden z-10 my-8 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Close Button Header */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#080D18]/80 hover:bg-[#2563EB] border border-[#243650] hover:border-[#38BDF8] text-[#9FB0C8] hover:text-white flex items-center justify-center transition-all shadow-lg"
          aria-label="Close project modal"
        >
          <X size={18} />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Main Visual Preview */}
          <div className="relative aspect-[16/9] sm:aspect-[16/8] rounded-2xl overflow-hidden bg-[#080D18] border border-[#243650]">
            <img
              src={project.thumbnailAsset}
              alt={project.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#101D35] via-transparent to-black/30 pointer-events-none" />

            {/* Badges in Image */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#2563EB] text-white border border-[#38BDF8]/60 shadow-lg">
                {project.category}
              </span>
              {project.isCollaborative && (
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-purple-600/80 text-white border border-purple-400 shadow-lg flex items-center gap-1.5">
                  <Users size={12} />
                  <span>Collaborative Team Project</span>
                </span>
              )}
            </div>
          </div>

          {/* Title & Tagline */}
          <div>
            <h2
              id="modal-project-title"
              className="text-2xl sm:text-3xl font-extrabold text-[#DCE6F5] tracking-tight leading-tight"
            >
              {project.title}
            </h2>
            <p className="text-sm sm:text-base text-[#38BDF8] font-medium mt-1.5">
              {project.tagline}
            </p>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#9FB0C8] font-bold">
              Project Overview & Architecture
            </h4>
            <div className="p-4 rounded-2xl bg-[#080D18]/70 border border-[#243650] text-sm text-[#DCE6F5]/90 leading-relaxed whitespace-pre-line">
              {project.description}
            </div>
          </div>

          {/* Special Attribution Note if Present */}
          {project.attributionNotes && (
            <div className="p-4 rounded-2xl bg-[#2563EB]/10 border border-[#2563EB]/30 flex items-start gap-3">
              <Info size={16} className="text-[#38BDF8] shrink-0 mt-0.5" />
              <div className="text-xs text-[#DCE6F5] leading-relaxed">
                <span className="font-semibold text-[#38BDF8]">Attribution Note: </span>
                {project.attributionNotes}
              </div>
            </div>
          )}

          {/* Student Contributors */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#9FB0C8] font-bold mb-3 flex items-center gap-1.5">
              <Users size={13} className="text-[#38BDF8]" />
              <span>Project Contributors & Portfolio Links</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.contributors.map((name, idx) => {
                const studentId = project.contributorIds[idx];
                const student = studentId ? getStudentById(studentId) : undefined;

                return (
                  <div
                    key={name}
                    className="p-3.5 rounded-2xl bg-[#080D18] border border-[#243650] flex items-center justify-between gap-3 hover:border-[#38BDF8]/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#101D35] to-[#2563EB]/40 border border-[#2563EB]/40 flex items-center justify-center text-xs font-mono font-bold text-[#DCE6F5]">
                        {student?.avatarInitials || name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#DCE6F5]">{name}</div>
                        <div className="text-[11px] text-[#9FB0C8] truncate max-w-[150px]">
                          {student?.tagline || 'Student Developer'}
                        </div>
                      </div>
                    </div>

                    {student && onSelectStudent && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onSelectStudent(student);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-[#2563EB]/15 hover:bg-[#2563EB] text-[#38BDF8] hover:text-white border border-[#2563EB]/30 text-xs font-mono font-semibold transition-all flex items-center gap-1"
                      >
                        <span>Portfolio</span>
                        <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Action Bar */}
        <div className="p-6 bg-[#080D18]/90 border-t border-[#243650] flex flex-wrap items-center justify-between gap-4 mt-auto">
          <div className="flex items-center gap-2 text-xs font-mono text-[#9FB0C8]">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span>Verified Binary Battle Club Submission</span>
          </div>

          <div className="flex items-center gap-3">
            {hasGithub && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#101D35] hover:bg-[#172945] border border-[#243650] hover:border-[#38BDF8] text-[#DCE6F5] text-xs font-mono font-semibold flex items-center gap-2 transition-all shadow-sm"
              >
                <GithubIcon size={15} />
                <span>GitHub Repository</span>
              </a>
            )}

            {hasLiveDemo && (
              <a
                href={project.workingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white border border-[#38BDF8] text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#2563EB]/30"
              >
                <span>Launch Live Project</span>
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
