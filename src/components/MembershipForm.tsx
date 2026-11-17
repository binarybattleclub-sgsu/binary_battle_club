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
        <div className="w-14 h-14 rounded-full border border-[#38BDF8]/40 bg-[#2563EB]/15 text-[#38BDF8] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(56,189,248,0.25)]">
          <CheckCircle2 size={30} />
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-mono tracking-widest uppercase text-[#38BDF8]">
            APPLICATION_RECEIVED // STATUS: VALIDATED
          </p>
          <h3 className="text-xl sm:text-2xl font-light tracking-wide text-[#DCE6F5]">
            Welcome, <span className="font-semibold text-[#38BDF8]">{formData.fullName}</span>!
          </h3>
          <p className="text-xs sm:text-sm text-[#9FB0C8] max-w-md mx-auto leading-relaxed">
            Your application has been logged. Our student developer corps will contact you via your university email address (<span className="text-[#38BDF8]">{formData.email}</span>).
          </p>
        </div>

        {/* Details Summary */}
        <div className="bg-[#080D18]/90 rounded-2xl p-5 border border-[#243650] text-left text-xs space-y-2 max-w-md mx-auto font-mono">
          <div className="flex justify-between">
            <span className="text-[#9FB0C8]">Student ID:</span>
            <span className="text-[#DCE6F5]">{formData.studentId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#9FB0C8]">Department:</span>
            <span className="text-[#DCE6F5] truncate max-w-[220px]">{formData.schoolDepartment}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#9FB0C8]">Semester:</span>
            <span className="text-[#38BDF8]">{formData.semester}</span>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary text-xs uppercase tracking-widest"
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
          <label className="block text-[11px] font-mono tracking-widest text-[#DCE6F5] uppercase font-semibold">
            FULL NAME <span className="text-[#38BDF8]">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="e.g. Aarav Sharma"
            className={`w-full bg-transparent border-0 border-b pb-2 pt-1 text-sm text-[#DCE6F5] placeholder:text-[#9FB0C8]/40 focus:outline-none transition-colors ${
              errors.fullName
                ? 'border-[#f87171] focus:border-[#ef4444]'
                : 'border-[#243650] focus:border-[#38BDF8]'
            }`}
          />
          {errors.fullName && (
            <p className="text-[10px] text-[#f87171] font-mono mt-1 flex items-center gap-1">
              <AlertCircle size={10} /> {errors.fullName}
            </p>
          )}
        </div>

        {/* 2. UNIVERSITY EMAIL */}
        <div className="space-y-1">
          <label className="block text-[11px] font-mono tracking-widest text-[#DCE6F5] uppercase font-semibold">
            UNIVERSITY EMAIL <span className="text-[#38BDF8]">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="student@sgsu.edu.in"
            className={`w-full bg-transparent border-0 border-b pb-2 pt-1 text-sm text-[#DCE6F5] placeholder:text-[#9FB0C8]/40 focus:outline-none transition-colors ${
              errors.email
                ? 'border-[#f87171] focus:border-[#ef4444]'
                : 'border-[#243650] focus:border-[#38BDF8]'
            }`}
          />
          {errors.email && (
            <p className="text-[10px] text-[#f87171] font-mono mt-1 flex items-center gap-1">
              <AlertCircle size={10} /> {errors.email}
            </p>
          )}
        </div>

        {/* 3. STUDENT ID / ENROLLMENT NUMBER */}
        <div className="space-y-1">
          <label className="block text-[11px] font-mono tracking-widest text-[#DCE6F5] uppercase font-semibold">
            STUDENT ID / ENROLLMENT NUMBER <span className="text-[#38BDF8]">*</span>
          </label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            placeholder="e.g. SGSU-2024-CSE-042"
            className={`w-full bg-transparent border-0 border-b pb-2 pt-1 text-sm text-[#DCE6F5] placeholder:text-[#9FB0C8]/40 focus:outline-none transition-colors ${
              errors.studentId
                ? 'border-[#f87171] focus:border-[#ef4444]'
                : 'border-[#243650] focus:border-[#38BDF8]'
            }`}
          />
          {errors.studentId && (
            <p className="text-[10px] text-[#f87171] font-mono mt-1 flex items-center gap-1">
              <AlertCircle size={10} /> {errors.studentId}
            </p>
          )}
        </div>

        {/* 4. SCHOOL / DEPARTMENT */}
        <div className="space-y-1">
          <label className="block text-[11px] font-mono tracking-widest text-[#DCE6F5] uppercase font-semibold">
            SCHOOL / DEPARTMENT <span className="text-[#38BDF8]">*</span>
          </label>
          <input
            type="text"
            name="schoolDepartment"
            value={formData.schoolDepartment}
            onChange={handleChange}
            placeholder="e.g. School of Future Skills & IT"
            className={`w-full bg-transparent border-0 border-b pb-2 pt-1 text-sm text-[#DCE6F5] placeholder:text-[#9FB0C8]/40 focus:outline-none transition-colors ${
              errors.schoolDepartment
                ? 'border-[#f87171] focus:border-[#ef4444]'
                : 'border-[#243650] focus:border-[#38BDF8]'
            }`}
          />
          {errors.schoolDepartment && (
            <p className="text-[10px] text-[#f87171] font-mono mt-1 flex items-center gap-1">
              <AlertCircle size={10} /> {errors.schoolDepartment}
            </p>
          )}
        </div>

        {/* 5. CURRENT SEMESTER */}
        <div className="space-y-1 sm:col-span-2">
          <label className="block text-[11px] font-mono tracking-widest text-[#DCE6F5] uppercase font-semibold">
            CURRENT SEMESTER <span className="text-[#38BDF8]">*</span>
          </label>
          <input
            type="text"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            placeholder="e.g. Semester 3 / 2nd Year"
            className={`w-full bg-transparent border-0 border-b pb-2 pt-1 text-sm text-[#DCE6F5] placeholder:text-[#9FB0C8]/40 focus:outline-none transition-colors ${
              errors.semester
                ? 'border-[#f87171] focus:border-[#ef4444]'
                : 'border-[#243650] focus:border-[#38BDF8]'
            }`}
          />
          {errors.semester && (
            <p className="text-[10px] text-[#f87171] font-mono mt-1 flex items-center gap-1">
              <AlertCircle size={10} /> {errors.semester}
            </p>
          )}
        </div>
      </div>

      {/* 6. WHY DO YOU WANT TO JOIN BINARY BATTLE CLUB? */}
      <div className="space-y-1 pt-2">
        <label className="block text-[11px] font-mono tracking-widest text-[#DCE6F5] uppercase font-semibold">
          WHY DO YOU WANT TO JOIN BINARY BATTLE CLUB? <span className="text-[#38BDF8]">*</span>
        </label>
        <textarea
          name="reasonToJoin"
          rows={3}
          value={formData.reasonToJoin}
          onChange={handleChange}
          placeholder="Describe your motivation, skills you'd love to develop, and how you want to contribute to the community..."
          className={`w-full bg-transparent border-0 border-b pb-2 pt-1 text-sm text-[#DCE6F5] placeholder:text-[#9FB0C8]/40 focus:outline-none transition-colors resize-none ${
            errors.reasonToJoin
              ? 'border-[#f87171] focus:border-[#ef4444]'
              : 'border-[#243650] focus:border-[#38BDF8]'
          }`}
        />
        {errors.reasonToJoin && (
          <p className="text-[10px] text-[#f87171] font-mono mt-1 flex items-center gap-1">
            <AlertCircle size={10} /> {errors.reasonToJoin}
          </p>
        )}
      </div>

      {/* SUBMIT BUTTON */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary text-xs uppercase tracking-widest px-8 py-3 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-[#38BDF8] rounded-full animate-spin" />
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
