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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-[#2563EB]/10 text-[#38BDF8] border border-[#2563EB]/30 mb-3 shadow-[0_0_15px_rgba(37,99,235,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
            {badge}
          </div>
        )}
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#DCE6F5] tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 text-xs sm:text-sm text-[#9FB0C8] max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
