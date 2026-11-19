import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import {
  ApplicationFormData,
  validateApplicationForm,
  submitMembershipApplication,
} from '../services/membershipService';

interface FormErrors {
  [key: string]: string;
}

export const MembershipForm: React.FC = () => {
  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: '',
    email: '',
    studentId: '',
    schoolDepartment: '',
    semester: '',
    reasonToJoin: '',
    website: '', // Honeypot
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<ApplicationFormData | null>(null);
  const [submissionTimestamp, setSubmissionTimestamp] = useState<string | null>(null);

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
    if (apiError) {
      setApiError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate clicks while processing

    setApiError(null);

    // 1. Client-side validation
    const validationErrors = validateApplicationForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. Submit to secure backend proxy
      const result = await submitMembershipApplication(formData);

      if (result.success) {
        // Confirmed spreadsheet success
        setSubmittedData({ ...formData });
        setSubmissionTimestamp(result.timestamp || new Date().toISOString());
        setIsSubmitted(true);
      } else {
        // Preserve entered form data and display helpful error message
        setApiError(
          result.error ||
            'Submission could not be completed. Please check your connection and try again.'
        );
      }
    } catch (err: any) {
      setApiError('An unexpected transmission error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    // Clear the form only after confirmed success when submitting another application
    setFormData({
      fullName: '',
      email: '',
      studentId: '',
      schoolDepartment: '',
      semester: '',
      reasonToJoin: '',
      website: '',
    });
    setSubmittedData(null);
    setSubmissionTimestamp(null);
    setErrors({});
    setApiError(null);
    setIsSubmitted(false);
  };

  if (isSubmitted && submittedData) {
    return (
      <div className="text-center py-12 px-4 space-y-6">
        <div className="w-14 h-14 rounded-full border border-[#38BDF8]/40 bg-[#2563EB]/15 text-[#38BDF8] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(56,189,248,0.25)]">
          <CheckCircle2 size={30} />
        </div>

        <div className="space-y-2">
          <p className="text-[11px] font-mono tracking-widest uppercase text-[#38BDF8]">
            APPLICATION_RECEIVED // STATUS: RECORDED_IN_SHEETS
          </p>
          <h3 className="text-xl sm:text-2xl font-light tracking-wide text-[#DCE6F5]">
            Welcome, <span className="font-semibold text-[#38BDF8]">{submittedData.fullName}</span>!
          </h3>
          <p className="text-xs sm:text-sm text-[#9FB0C8] max-w-md mx-auto leading-relaxed">
            Your application has been logged to the club directory. Our student developer corps will contact you via your university email address (<span className="text-[#38BDF8]">{submittedData.email}</span>).
          </p>
          {submissionTimestamp && (
            <p className="text-[10px] font-mono text-[#9FB0C8]/60">
              Recorded at: {new Date(submissionTimestamp).toLocaleString()}
            </p>
          )}
        </div>

        {/* Details Summary */}
        <div className="bg-[#080D18]/90 rounded-2xl p-5 border border-[#243650] text-left text-xs space-y-2 max-w-md mx-auto font-mono">
          <div className="flex justify-between">
            <span className="text-[#9FB0C8]">Student ID:</span>
            <span className="text-[#DCE6F5]">{submittedData.studentId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#9FB0C8]">Department:</span>
            <span className="text-[#DCE6F5] truncate max-w-[220px]">{submittedData.schoolDepartment}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#9FB0C8]">Semester:</span>
            <span className="text-[#38BDF8]">{submittedData.semester}</span>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary text-xs uppercase tracking-widest cursor-pointer"
          >
            SUBMIT ANOTHER APPLICATION
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Honeypot field for anti-spam (invisible to human visitors) */}
      <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
        <input
          type="text"
          name="website"
          value={formData.website || ''}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* API / Transmission Error Banner */}
      {apiError && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 text-xs font-mono flex items-start gap-3 shadow-lg">
          <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-red-300 uppercase tracking-wider block">
              SUBMISSION_ERROR
            </span>
            <p className="text-red-200/90 leading-relaxed font-sans text-xs">
              {apiError}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        {/* 1. FULL NAME */}
        <div className="space-y-1">
          <label className="block text-[11px] font-mono tracking-widest text-[#DCE6F5] uppercase font-semibold">
            FULL NAME <span className="text-[#38BDF8]">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            disabled={isSubmitting}
            value={formData.fullName}
            onChange={handleChange}
            placeholder="e.g. Aarav Sharma"
            className={`w-full bg-transparent border-0 border-b pb-2 pt-1 text-sm text-[#DCE6F5] placeholder:text-[#9FB0C8]/40 focus:outline-none transition-colors disabled:opacity-50 ${
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
            disabled={isSubmitting}
            value={formData.email}
            onChange={handleChange}
            placeholder="student@sgsu.edu.in"
            className={`w-full bg-transparent border-0 border-b pb-2 pt-1 text-sm text-[#DCE6F5] placeholder:text-[#9FB0C8]/40 focus:outline-none transition-colors disabled:opacity-50 ${
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
            disabled={isSubmitting}
            value={formData.studentId}
            onChange={handleChange}
            placeholder="e.g. SGSU-2024-CSE-042"
            className={`w-full bg-transparent border-0 border-b pb-2 pt-1 text-sm text-[#DCE6F5] placeholder:text-[#9FB0C8]/40 focus:outline-none transition-colors disabled:opacity-50 ${
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
            disabled={isSubmitting}
            value={formData.schoolDepartment}
            onChange={handleChange}
            placeholder="e.g. School of Future Skills & IT"
            className={`w-full bg-transparent border-0 border-b pb-2 pt-1 text-sm text-[#DCE6F5] placeholder:text-[#9FB0C8]/40 focus:outline-none transition-colors disabled:opacity-50 ${
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
            disabled={isSubmitting}
            value={formData.semester}
            onChange={handleChange}
            placeholder="e.g. Semester 3 / 2nd Year"
            className={`w-full bg-transparent border-0 border-b pb-2 pt-1 text-sm text-[#DCE6F5] placeholder:text-[#9FB0C8]/40 focus:outline-none transition-colors disabled:opacity-50 ${
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
          disabled={isSubmitting}
          rows={3}
          value={formData.reasonToJoin}
          onChange={handleChange}
          placeholder="Describe your motivation, skills you'd love to develop, and how you want to contribute to the community..."
          className={`w-full bg-transparent border-0 border-b pb-2 pt-1 text-sm text-[#DCE6F5] placeholder:text-[#9FB0C8]/40 focus:outline-none transition-colors resize-none disabled:opacity-50 ${
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
          className="btn-primary text-xs uppercase tracking-widest px-8 py-3 disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-lg shadow-[#2563EB]/25"
        >
          {isSubmitting ? (
            <>
              <RefreshCw size={14} className="animate-spin text-[#38BDF8]" />
              <span>TRANSMITTING_APPLICATION...</span>
            </>
          ) : (
            <span>SUBMIT APPLICATION</span>
          )}
        </button>
      </div>
    </form>
  );
};
