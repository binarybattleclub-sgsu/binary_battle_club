/**
 * Binary Battle Club — Membership Application Service
 * Connects the frontend application form to the secure server-side endpoint.
 */

export interface ApplicationFormData {
  fullName: string;
  email: string;
  studentId: string;
  schoolDepartment: string;
  semester: string;
  reasonToJoin: string;
  website?: string; // Honeypot
}

export interface SubmissionResponse {
  success: boolean;
  message?: string;
  error?: string;
  timestamp?: string;
}

/**
 * Validates all 6 required application fields on the client
 */
export function validateApplicationForm(data: ApplicationFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  // 1. Full Name
  if (!data.fullName || !data.fullName.trim()) {
    errors.fullName = 'Full Name is required';
  } else if (data.fullName.trim().length > 100) {
    errors.fullName = 'Full Name must not exceed 100 characters';
  }

  // 2. University Email
  if (!data.email || !data.email.trim()) {
    errors.email = 'University Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'Please enter a valid university email address';
  }

  // 3. Student ID / Enrollment Number
  if (!data.studentId || !data.studentId.trim()) {
    errors.studentId = 'Student ID / Enrollment Number is required';
  }

  // 4. School / Department
  if (!data.schoolDepartment || !data.schoolDepartment.trim()) {
    errors.schoolDepartment = 'School / Department is required';
  }

  // 5. Current Semester
  if (!data.semester || !data.semester.trim()) {
    errors.semester = 'Semester is required';
  }

  // 6. Why do you want to join Binary Battle Club?
  if (!data.reasonToJoin || !data.reasonToJoin.trim()) {
    errors.reasonToJoin = 'Please share why you want to join Binary Battle Club';
  } else if (data.reasonToJoin.trim().length < 15) {
    errors.reasonToJoin = 'Please write at least 15 characters describing your motivation';
  }

  return errors;
}

/**
 * Submits the application payload to the server-side API endpoint
 */
export async function submitMembershipApplication(
  formData: ApplicationFormData
): Promise<SubmissionResponse> {
  // Client-side pre-validation
  const validationErrors = validateApplicationForm(formData);
  if (Object.keys(validationErrors).length > 0) {
    const firstError = Object.values(validationErrors)[0];
    return {
      success: false,
      error: firstError,
    };
  }

  try {
    const response = await fetch('/api/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        studentId: formData.studentId.trim(),
        schoolDepartment: formData.schoolDepartment.trim(),
        semester: formData.semester.trim(),
        reasonToJoin: formData.reasonToJoin.trim(),
        website: formData.website || '',
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        error:
          data?.error ||
          data?.message ||
          `Submission failed with status code ${response.status}. Please try again.`,
      };
    }

    if (!data || data.success === false) {
      return {
        success: false,
        error: data?.error || data?.message || 'Submission was rejected by the server.',
      };
    }

    return {
      success: true,
      message: data.message || 'Application submitted successfully!',
      timestamp: data.timestamp || new Date().toISOString(),
    };
  } catch (err: any) {
    return {
      success: false,
      error:
        err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')
          ? 'Network connection error. Please verify your internet connection and try again.'
          : err.message || 'An unexpected error occurred while submitting your application.',
    };
  }
}
