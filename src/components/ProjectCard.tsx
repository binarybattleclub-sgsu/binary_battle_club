import React from 'react';
import { ExternalLink, Code2 } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { StudentProject } from '../data/projects';

interface ProjectCardProps {
  project: StudentProject;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-[#0a0f1e]/85 backdrop-blur-xl rounded-3xl border border-white/10 shadow-lg hover:shadow-[0_0_30px_rgba(99,102,241,0.25)] hover:border-indigo-500/50 transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Project Thumbnail with Aspect Ratio */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80';
          }}
        />
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase bg-slate-950/80 text-cyan-300 backdrop-blur-md border border-cyan-500/30">
            {project.category}
          </span>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Student Profile Info */}
          <div className="flex items-center gap-3 mb-3">
            <img
              src={project.studentAvatar}
              alt={project.studentName}
              className="w-9 h-9 rounded-full object-cover border-2 border-indigo-500/40 shadow-xs"
            />
            <div className="min-w-0">
              <h4 className="text-xs font-semibold text-slate-200 truncate">
                {project.studentName}
              </h4>
              <p className="text-[11px] text-slate-400 font-mono truncate">
                {project.studentRole}
              </p>
            </div>
          </div>

          {/* Project Title */}
          <h3 className="text-base font-bold text-white mb-2 leading-snug group-hover:text-cyan-300 transition-colors">
            {project.title}
          </h3>

          {/* Project Description */}
          <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 mb-4 leading-relaxed">
            {project.description}
          </p>

          {/* Technology Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-white/5 text-slate-300 border border-white/10"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button: View Project */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl transition-all shadow-md group/btn"
          >
            <span>LIVE DEMO</span>
            <ExternalLink size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </a>

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="View Repository"
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <GithubIcon size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
