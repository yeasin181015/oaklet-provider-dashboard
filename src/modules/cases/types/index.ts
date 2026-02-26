export type CaseStatus = 'open' | 'in_progress' | 'pending_review' | 'resolved' | 'closed';
export type CasePriority = 'urgent' | 'high' | 'normal' | 'low';
export type CaseType = 'initial_consult' | 'follow_up' | 'lab_review' | 'prescription_refill' | 'referral' | 'general';
export type SortField = 'created_at' | 'updated_at' | 'priority' | 'due_date';
export type SortOrder = 'asc' | 'desc';

export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  mrn: string;
  phone?: string;
  email?: string;
}

export interface Case {
  id: string;
  practice_id: string;
  practice_name: string;
  patient: Patient;
  type: CaseType;
  status: CaseStatus;
  priority: CasePriority;
  subject: string;
  assigned_provider_id: string;
  created_at: string;
  updated_at: string;
  due_date: string | null;
  tags: string[];
  unread_messages: number;
}

export interface TimelineEvent {
  id: string;
  type: 'case_created' | 'message' | 'note_added' | 'status_changed' | 'assigned';
  timestamp: string;
  actor: string;
  details: string;
}

export interface CaseDetail extends Case {
  description: string;
  patient: Patient & { phone: string; email: string };
  timeline: TimelineEvent[];
}

export interface CaseSummary {
  total_open: number;
  by_priority: {
    urgent: number;
    high: number;
    normal: number;
    low: number;
  };
  by_status: {
    open: number;
    in_progress: number;
    pending_review: number;
    resolved: number;
  };
  overdue: number;
  due_today: number;
  unread_messages: number;
  by_practice: Array<{
    practice_id: string;
    practice_name: string;
    count: number;
  }>;
}

export interface CaseFilters {
  practice_id?: string;
  status?: CaseStatus;
  priority?: CasePriority;
  search?: string;
  sort_by?: SortField;
  sort_order?: SortOrder;
  page?: number;
  per_page?: number;
}
