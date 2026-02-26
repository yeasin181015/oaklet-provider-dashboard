import { apiClient } from '@/lib/api-client';
import { API_ROUTES } from '@/lib/routes/api-routes';
import type { ListEnvelope } from '@/types';
import type { Case, CaseDetail, CaseFilters, CaseSummary } from '../types';

export const casesService = {
  list(filters: CaseFilters = {}): Promise<ListEnvelope<Case>> {
    return apiClient.get(API_ROUTES.cases.list, filters);
  },

  get(id: string): Promise<CaseDetail> {
    return apiClient.get(API_ROUTES.cases.getById(id));
  },

  summary(practiceId?: string): Promise<CaseSummary> {
    return apiClient.get(API_ROUTES.cases.summary, practiceId ? { practice_id: practiceId } : undefined);
  },
};
