import React from 'react';
import { Users } from 'lucide-react';
import {
  StudentProfile,
  ProjectLabItem,
  getAllStudents,
  getAllProjects,
} from '../../data/projectLabData';
import { StudentProfileCard } from './StudentProfileCard';

interface StudentDirectoryProps {
  students?: StudentProfile[];
  projects?: ProjectLabItem[];
  onSelectStudent: (student: StudentProfile) => void;
}

export const StudentDirectory: React.FC<StudentDirectoryProps> = ({
  students = getAllStudents(),
  projects = getAllProjects(),
  onSelectStudent,
}) => {
  return (
    <section className="relative py-12 md:py-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/30 text-[#38BDF8] text-xs font-mono mb-3">
            <Users size={13} />
            <span>TALENT DIRECTORY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#DCE6F5] tracking-tight">
            Meet the <span className="bg-gradient-to-r from-[#38BDF8] to-[#2563EB] bg-clip-text text-transparent">Builders</span>
          </h2>
          <p className="text-sm md:text-base text-[#9FB0C8] mt-2 max-w-2xl">
            Explore developer portfolios of the students designing, engineering, and launching innovative systems across AI, web platforms, and cybersecurity.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#9FB0C8] self-start md:self-auto bg-[#101D35] px-3.5 py-1.5 rounded-xl border border-[#243650]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{students.length} Verified Contributors</span>
        </div>
      </div>

      {/* 3-Column Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <StudentProfileCard
            key={student.id}
            student={student}
            projects={projects}
            onSelectStudent={onSelectStudent}
          />
        ))}
      </div>
    </section>
  );
};
