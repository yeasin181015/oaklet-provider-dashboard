import { CasePriority, CaseStatus } from "../types";

export const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'pending_review', label: 'Pending Review' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

export const PRIORITY_OPTIONS = [
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'normal', label: 'Normal' },
  { value: 'low', label: 'Low' },
];

export const SORT_OPTIONS = [
  { value: 'updated_at', label: 'Last Updated' },
  { value: 'due_date', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'created_at', label: 'Created' },
];

export const SORT_ORDER_OPTIONS = [
  { value: 'desc', label: '↓ Newest first' },
  { value: 'asc', label: '↑ Oldest first' },
];

export const STATUS_LABELS: Record<CaseStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  pending_review: 'Pending Review',
  resolved: 'Resolved',
  closed: 'Closed',
};

export const PRIORITY_LABELS: Record<CasePriority, string> = {
  urgent: 'Urgent',
  high: 'High',
  normal: 'Normal',
  low: 'Low',
};

export const TYPE_LABELS: Record<string, string> = {
  initial_consult: 'Initial Consult',
  follow_up: 'Follow-Up',
  lab_review: 'Lab Review',
  prescription_refill: 'Rx Refill',
  referral: 'Referral',
  general: 'General',
};