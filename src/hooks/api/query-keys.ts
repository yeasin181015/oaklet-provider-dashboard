import type { CaseFilters } from '@/modules/cases/types';

export const queryKeys = {
  cases: {
    all: ['cases'] as const,
    list: (filters: CaseFilters) => ['cases', 'list', filters] as const,
    detail: (id: string) => ['cases', 'detail', id] as const,
    summary: (practiceId?: string) => ['cases', 'summary', practiceId] as const,
  },
  practices: {
    all: ['practices'] as const,
    list: () => ['practices', 'list'] as const,
  },
};
