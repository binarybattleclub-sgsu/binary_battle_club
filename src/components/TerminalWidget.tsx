import React, { useState } from 'react';
import { Terminal, Copy, Check, Sparkles } from 'lucide-react';

export const TerminalWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'status' | 'hackathon' | 'friday' | 'achieve'>('status');
  const [copied, setCopied] = useState(false);

  const snippets = {
    status: {
      cmd: 'club status --node "SGSU_CAMPUS"',
      output: [
        '⚡ Initializing Binary Battle Club runtime...',
        '✔ Community: Scope Global Skills University (SGSU)',
        '✔ School: Future Skills & Information Technology',
        '✔ Members: 100+ active student coders & builders',
        '✔ Motto: Think. Code. Create. Compete.',
        '🚀 Status: [READY] Coding battles underway.',
      ],
    },
    hackathon: {
      cmd: 'club hackathons --list-flagships',
      output: [
        '▶ 12-Hour SGSU Internal Hackathon [COMPLETED]',
        '  - Venue: University Auditorium & Labs',
        '  - Teams: Full-stack prototypes defending before jury',
        '▶ 24-Hour Navonamesh Hackathon [COMPLETED]',
        '  - Overnight sprint: High jury praise & awards',
        '▶ Google-Powered Hackathon [UPCOMING]',
        '  - Focus: Multimodal AI & Cloud Tooling',
      ],
    },
    friday: {
      cmd: 'club run friday-lab --every-week',
      output: [
        '📅 Schedule: Every Friday 2:30 PM - 4:30 PM',
        '📍 Venue: Computer Center Lab 3, SGSU',
        '🔥 Focus: Python, PyTorch, React & System Design',
        '🎓 Certification: Semester-wide Global Cert Roadmap',
        '💡 Mentorship: By the Students, For the Students',
      ],
    },
    achieve: {
      cmd: 'club verify --champions --national',
      output: [
        '🏆 36th National WorkSkills Competition -> NATIONAL CHAMPIONS',
        '🥇 BGI Hackathon Winners (13th & 14th May) -> 1st Place Trophy',
        '🌟 4 Teams Qualified for Final Round (26-27 Sept)',
        '🎖️ CII 2026 Web Technology -> Siddhesh Kewate Honors',
        '✨ INNOverse 2024 -> Premier Innovation Showcase',
      ],
    },
  };

  const current = snippets[activeTab];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden bg-[#070b16] border border-white/10 shadow-[0_0_50px_rgba(99,102,241,0.25)] flex flex-col font-mono text-xs">
      {/* Glow accent halo */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0a1020] border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          <span className="ml-2 text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
            <Terminal size={12} className="text-cyan-400" />
            <span>club_interactive_shell</span>
          </span>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-1">
          {(['status', 'hackathon', 'friday', 'achieve'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-2 py-1 rounded text-[10px] uppercase font-bold transition-all ${
                activeTab === tab
                  ? 'bg-indigo-600/40 text-cyan-300 border border-cyan-400/30 shadow-[0_0_10px_rgba(0,242,254,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-5 space-y-3 min-h-[220px] bg-gradient-to-b from-[#070b16] to-[#040710]">
        {/* Command line prompt */}
        <div className="flex items-center justify-between text-slate-300 border-b border-white/5 pb-2">
          <div className="flex items-center gap-2 truncate">
            <span className="text-cyan-400 font-bold">sgsu@club:~$</span>
            <span className="text-white font-medium truncate">{current.cmd}</span>
            <span className="w-2 h-4 bg-cyan-400 animate-pulse"></span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title="Copy command"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          </button>
        </div>

        {/* Terminal output lines */}
        <div className="space-y-1.5 text-[11px] leading-relaxed">
          {current.output.map((line, idx) => (
            <div
              key={idx}
              className={`${
                line.includes('🏆') || line.includes('✔') || line.includes('🚀')
                  ? 'text-cyan-300 font-medium'
                  : line.includes('▶') || line.includes('📅')
                  ? 'text-indigo-300 font-semibold'
                  : 'text-slate-400'
              }`}
            >
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* Terminal Bottom Status */}
      <div className="px-4 py-2 bg-[#050812] border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
        <span>SESSION: ENCRYPTED // SGSU_WS</span>
        <span className="text-emerald-400 flex items-center gap-1 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          LIVE SHELL
        </span>
      </div>
    </div>
  );
};
