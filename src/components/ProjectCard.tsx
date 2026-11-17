import React from 'react';
import { ExternalLink } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { StudentProject } from '../data/projects';

interface ProjectCardProps {
  project: StudentProject;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-[#101D35]/85 backdrop-blur-xl rounded-3xl border border-[#243650] shadow-lg hover:shadow-[0_12px_35px_rgba(8,13,24,0.8),0_0_20px_rgba(37,99,235,0.18)] hover:border-[#38BDF8]/40 hover:bg-[#172945]/90 transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Project Thumbnail with Aspect Ratio */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#080D18]">
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
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase bg-[#080D18]/85 text-[#38BDF8] backdrop-blur-md border border-[#243650]">
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
              className="w-9 h-9 rounded-full object-cover border-2 border-[#2563EB]/40 shadow-xs"
            />
            <div className="min-w-0">
              <h4 className="text-xs font-semibold text-[#DCE6F5] truncate">
                {project.studentName}
              </h4>
              <p className="text-[11px] text-[#9FB0C8] font-mono truncate">
                {project.studentRole}
              </p>
            </div>
          </div>

          {/* Project Title */}
          <h3 className="text-base font-bold text-[#DCE6F5] mb-2 leading-snug group-hover:text-[#38BDF8] transition-colors">
            {project.title}
          </h3>

          {/* Project Description */}
          <p className="text-xs sm:text-sm text-[#9FB0C8] line-clamp-3 mb-4 leading-relaxed">
            {project.description}
          </p>

          {/* Technology Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-[#080D18] text-[#9FB0C8] border border-[#243650]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button: View Project */}
        <div className="pt-3 border-t border-[#243650] flex items-center justify-between">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs py-2 px-4"
          >
            <span>LIVE DEMO</span>
            <ExternalLink size={13} />
          </a>

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="View Repository"
              className="p-2 text-[#9FB0C8] hover:text-[#DCE6F5] hover:bg-[#172945] rounded-lg transition-colors border border-transparent hover:border-[#243650]"
            >
              <GithubIcon size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
