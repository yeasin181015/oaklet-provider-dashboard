import { apiClient } from '@/lib/api-client';
import type { ListEnvelope } from '@/types';
import type { Case, CaseDetail, CaseSummary, CaseFilters } from '../types';

function buildQuery(filters: CaseFilters): string {
  const params = new URLSearchParams();
  if (filters.practice_id) params.set('practice_id', filters.practice_id);
  if (filters.status) params.set('status', filters.status);
  if (filters.priority) params.set('priority', filters.priority);
  if (filters.search) params.set('search', filters.search);
  if (filters.sort_by) params.set('sort_by', filters.sort_by);
  if (filters.sort_order) params.set('sort_order', filters.sort_order);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.per_page) params.set('per_page', String(filters.per_page));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const casesService = {
  list(filters: CaseFilters = {}): Promise<ListEnvelope<Case>> {
    return apiClient.get(`/cases${buildQuery(filters)}`);
  },

  get(id: string): Promise<CaseDetail> {
    return apiClient.get(`/cases/${id}`);
  },

  summary(practiceId?: string): Promise<CaseSummary> {
    const qs = practiceId ? `?practice_id=${practiceId}` : '';
    return apiClient.get(`/cases/summary${qs}`);
  },
};
