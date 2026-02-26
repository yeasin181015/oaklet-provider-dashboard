import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/hooks/api/query-keys';
import { casesService } from '../services/service';
import type { CaseFilters } from '../types';

export function useCases(filters: CaseFilters = {}) {
  return useQuery({
    queryKey: queryKeys.cases.list(filters),
    queryFn: () => casesService.list(filters),
  });
}

export function useCaseDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.cases.detail(id),
    queryFn: () => casesService.get(id),
    enabled: !!id,
  });
}

export function useCaseSummary(practiceId?: string) {
  return useQuery({
    queryKey: queryKeys.cases.summary(practiceId),
    queryFn: () => casesService.summary(practiceId),
  });
}
