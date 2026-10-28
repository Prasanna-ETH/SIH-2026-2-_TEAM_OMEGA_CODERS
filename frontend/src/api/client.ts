const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export const apiClient = {
  // Dashboard
  getAicteSummary: async () => {
    const res = await fetch(`${API_BASE}/dashboard/aicte-summary`);
    if (!res.ok) throw new Error('Failed to fetch AICTE summary');
    return res.json();
  },

  getInstitutionSummary: async (instId: number = 1) => {
    const res = await fetch(`${API_BASE}/dashboard/institution-summary/${instId}`);
    if (!res.ok) throw new Error('Failed to fetch institution summary');
    return res.json();
  },

  // Institutions
  getInstitutions: async (state?: string, status?: string) => {
    const params = new URLSearchParams();
    if (state) params.append('state', state);
    if (status) params.append('status', status);
    const res = await fetch(`${API_BASE}/institutions?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch institutions');
    return res.json();
  },

  getInstitutionProfile: async (id: number) => {
    const res = await fetch(`${API_BASE}/institutions/${id}`);
    if (!res.ok) throw new Error('Failed to fetch institution profile');
    return res.json();
  },

  // Students
  getStudents: async (params: { institution_id?: number; programme_id?: number; category?: string; search?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params.institution_id) query.append('institution_id', params.institution_id.toString());
    if (params.programme_id) query.append('programme_id', params.programme_id.toString());
    if (params.category) query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    const res = await fetch(`${API_BASE}/students?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
  },

  getStudentDetail: async (id: number) => {
    const res = await fetch(`${API_BASE}/students/${id}`);
    if (!res.ok) throw new Error('Failed to fetch student details');
    return res.json();
  },

  // Upload & Validation pipeline
  prevalidateUpload: async (formData: FormData) => {
    const res = await fetch(`${API_BASE}/students/upload-prevalidate`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Prevalidation failed' }));
      throw new Error(err.detail || 'Prevalidation failed');
    }
    return res.json();
  },

  commitUpload: async (payload: any) => {
    const res = await fetch(`${API_BASE}/students/upload-commit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to commit uploaded records');
    return res.json();
  },

  // Validation Centre
  getValidationIssues: async (severity?: string, status?: string, institutionId?: number) => {
    const query = new URLSearchParams();
    if (severity) query.append('severity', severity);
    if (status) query.append('status', status);
    if (institutionId) query.append('institution_id', institutionId.toString());
    const res = await fetch(`${API_BASE}/validation/issues?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch validation issues');
    return res.json();
  },

  resolveValidationIssue: async (id: number, payload: { action: string; resolution_notes: string; updated_apaar_id?: string }) => {
    const res = await fetch(`${API_BASE}/validation/${id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to resolve issue');
    return res.json();
  },

  // Duplicates
  getDuplicateCases: async (status?: string) => {
    const query = status ? `?status=${status}` : '';
    const res = await fetch(`${API_BASE}/duplicates${query}`);
    if (!res.ok) throw new Error('Failed to fetch duplicate cases');
    return res.json();
  },

  actionDuplicateCase: async (id: number, payload: { action: string; notes: string }) => {
    const res = await fetch(`${API_BASE}/duplicates/${id}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to take duplicate action');
    return res.json();
  },

  // Intake compliance
  getIntakeCompliance: async (filters?: { academic_year?: string; state?: string; institution_id?: number; status?: string }) => {
    const query = new URLSearchParams();
    if (filters?.academic_year) query.append('academic_year', filters.academic_year);
    if (filters?.state) query.append('state', filters.state);
    if (filters?.institution_id) query.append('institution_id', filters.institution_id.toString());
    if (filters?.status) query.append('status', filters.status);
    const res = await fetch(`${API_BASE}/intake-compliance?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch intake compliance');
    return res.json();
  },

  // Verification
  verifyStudent: async (payload: { identifier: string; requester_org: string; verification_purpose: string; consent_recorded?: boolean }) => {
    const res = await fetch(`${API_BASE}/verifications/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Verification failed' }));
      throw new Error(err.detail || 'Verification lookup failed');
    }
    return res.json();
  },

  getVerificationHistory: async () => {
    const res = await fetch(`${API_BASE}/verifications/history`);
    if (!res.ok) throw new Error('Failed to fetch verification history');
    return res.json();
  },

  // Analytics
  getAnalytics: async () => {
    const res = await fetch(`${API_BASE}/analytics/overview`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  // Audit
  getAuditLogs: async (params?: { role?: string; action?: string; user_id?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    if (params?.role) query.append('role', params.role);
    if (params?.action) query.append('action', params.action);
    if (params?.user_id) query.append('user_id', params.user_id);
    if (params?.page) query.append('page', params.page.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    const res = await fetch(`${API_BASE}/audit-logs?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  },

  // Notifications
  getNotifications: async (userRole?: string) => {
    const query = userRole ? `?user_role=${userRole}` : '';
    const res = await fetch(`${API_BASE}/notifications${query}`);
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  }
};
