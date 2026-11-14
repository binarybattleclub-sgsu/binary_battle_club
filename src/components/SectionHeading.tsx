import React from 'react';

interface SectionHeadingProps {
  badge?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  align?: 'left' | 'center';
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  title,
  subtitle,
  action,
  align = 'left',
}) => {
  return (
    <div
      className={`mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4 ${
        align === 'center' ? 'text-center items-center' : ''
      }`}
    >
      <div>
        {badge && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 mb-3 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            {badge}
          </div>
        )}
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
