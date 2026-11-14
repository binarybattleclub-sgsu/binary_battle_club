import React, { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  studentId: string;
  schoolDepartment: string;
  semester: string;
  reasonToJoin: string;
}

interface FormErrors {
  [key: string]: string;
}

export const MembershipForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    studentId: '',
    schoolDepartment: '',
    semester: '',
    reasonToJoin: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'University Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID / Enrollment Number is required';
    }

    if (!formData.schoolDepartment.trim()) {
      newErrors.schoolDepartment = 'School / Department is required';
    }

    if (!formData.semester.trim()) {
      newErrors.semester = 'Semester is required';
    }

    if (!formData.reasonToJoin.trim()) {
      newErrors.reasonToJoin = 'Please share why you want to join Binary Battle Club';
    } else if (formData.reasonToJoin.trim().length < 15) {
      newErrors.reasonToJoin = 'Please write at least 15 characters describing your motivation';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 700);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      studentId: '',
      schoolDepartment: '',
      semester: '',
      reasonToJoin: '',
    });
    setErrors({});
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12 px-4 space-y-6">
        <div className="w-14 h-14 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <CheckCircle2 size={30} />
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-mono tracking-widest uppercase text-emerald-400">
            APPLICATION_RECEIVED // STATUS: VALIDATED
          </p>
          <h3 className="text-xl sm:text-2xl font-light tracking-wide text-white">
            Welcome, <span className="font-semibold text-cyan-300">{formData.fullName}</span>!
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Your application has been logged. Our student developer corps will contact you via your university email address (<span className="text-cyan-300">{formData.email}</span>).
          </p>
        </div>

        {/* Details Summary */}
        <div className="bg-black/40 rounded-xl p-5 border border-white/10 text-left text-xs space-y-2 max-w-md mx-auto font-mono">
          <div className="flex justify-between">
            <span className="text-slate-500">Student ID:</span>
            <span className="text-slate-200">{formData.studentId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Department:</span>
            <span className="text-slate-200 truncate max-w-[220px]">{formData.schoolDepartment}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Semester:</span>
            <span className="text-cyan-400">{formData.semester}</span>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="border border-white/20 bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/40 text-white px-7 py-3 text-xs font-mono uppercase tracking-widest transition-all rounded-sm"
          >
            SUBMIT ANOTHER APPLICATION
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        {/* 1. FULL NAME */}
        <div className="space-y-1">
          <label className="block text-[11px] font-mono tracking-widest text-slate-300 uppercase font-semibold">
            FULL NAME <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="e.g. Aarav Sharma"
            className={`w-full bg-transparent border-0 border-b pb-2 pt-1 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-colors ${
              errors.fullName
                ? 'border-red-500 focus:border-red-400'
                : 'border-white/20 focus:border-white'
            }`}
          />
          {errors.fullName && (
            <p className="text-[10px] text-red-400 font-mono mt-1 flex items-center gap-1">
              <AlertCircle size={10} /> {errors.fullName}
            </p>
          )}
        </div>

        {/* 2. UNIVERSITY EMAIL */}
        <div className="space-y-1">
          <label className="block text-[11px] font-mono tracking-widest text-slate-300 uppercase font-semibold">
            UNIVERSITY EMAIL <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="student@sgsu.edu.in"
            className={`w-full bg-transparent border-0 border-b pb-2 pt-1 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-colors ${
              errors.email
                ? 'border-red-500 focus:border-red-400'
                : 'border-white/20 focus:border-white'
            }`}
          />
          {errors.email && (
            <p className="text-[10px] text-red-400 font-mono mt-1 flex items-center gap-1">
              <AlertCircle size={10} /> {errors.email}
            </p>
          )}
        </div>

        {/* 3. STUDENT ID / ENROLLMENT NUMBER */}
        <div className="space-y-1">
          <label className="block text-[11px] font-mono tracking-widest text-slate-300 uppercase font-semibold">
            STUDENT ID / ENROLLMENT NUMBER <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            placeholder="e.g. SGSU-2024-CSE-042"
            className={`w-full bg-transparent border-0 border-b pb-2 pt-1 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-colors ${
              errors.studentId
                ? 'border-red-500 focus:border-red-400'
                : 'border-white/20 focus:border-white'
            }`}
          />
          {errors.studentId && (
            <p className="text-[10px] text-red-400 font-mono mt-1 flex items-center gap-1">
              <AlertCircle size={10} /> {errors.studentId}
            </p>
          )}
        </div>

        {/* 4. SCHOOL / DEPARTMENT */}
        <div className="space-y-1">
          <label className="block text-[11px] font-mono tracking-widest text-slate-300 uppercase font-semibold">
            SCHOOL / DEPARTMENT <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="schoolDepartment"
            value={formData.schoolDepartment}
            onChange={handleChange}
            placeholder="e.g. School of Future Skills & IT"
            className={`w-full bg-transparent border-0 border-b pb-2 pt-1 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-colors ${
              errors.schoolDepartment
                ? 'border-red-500 focus:border-red-400'
                : 'border-white/20 focus:border-white'
            }`}
          />
          {errors.schoolDepartment && (
            <p className="text-[10px] text-red-400 font-mono mt-1 flex items-center gap-1">
              <AlertCircle size={10} /> {errors.schoolDepartment}
            </p>
          )}
        </div>

        {/* 5. CURRENT SEMESTER */}
        <div className="space-y-1 sm:col-span-2">
          <label className="block text-[11px] font-mono tracking-widest text-slate-300 uppercase font-semibold">
            CURRENT SEMESTER <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            placeholder="e.g. Semester 3 / 2nd Year"
            className={`w-full bg-transparent border-0 border-b pb-2 pt-1 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-colors ${
              errors.semester
                ? 'border-red-500 focus:border-red-400'
                : 'border-white/20 focus:border-white'
            }`}
          />
          {errors.semester && (
            <p className="text-[10px] text-red-400 font-mono mt-1 flex items-center gap-1">
              <AlertCircle size={10} /> {errors.semester}
            </p>
          )}
        </div>
      </div>

      {/* 6. WHY DO YOU WANT TO JOIN BINARY BATTLE CLUB? */}
      <div className="space-y-1 pt-2">
        <label className="block text-[11px] font-mono tracking-widest text-slate-300 uppercase font-semibold">
          WHY DO YOU WANT TO JOIN BINARY BATTLE CLUB? <span className="text-red-500">*</span>
        </label>
        <textarea
          name="reasonToJoin"
          rows={3}
          value={formData.reasonToJoin}
          onChange={handleChange}
          placeholder="Describe your motivation, skills you'd love to develop, and how you want to contribute to the community..."
          className={`w-full bg-transparent border-0 border-b pb-2 pt-1 text-sm text-white placeholder:text-slate-600 focus:outline-none transition-colors resize-none ${
            errors.reasonToJoin
              ? 'border-red-500 focus:border-red-400'
              : 'border-white/20 focus:border-white'
          }`}
        />
        {errors.reasonToJoin && (
          <p className="text-[10px] text-red-400 font-mono mt-1 flex items-center gap-1">
            <AlertCircle size={10} /> {errors.reasonToJoin}
          </p>
        )}
      </div>

      {/* SUBMIT BUTTON */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="border border-white/25 bg-white/[0.04] hover:bg-white/[0.1] hover:border-white/50 text-white px-8 py-3 text-xs font-mono uppercase tracking-widest transition-all rounded-sm flex items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>VALIDATING_DATA...</span>
            </>
          ) : (
            <span>SUBMIT APPLICATION</span>
          )}
        </button>
      </div>
    </form>
  );
};