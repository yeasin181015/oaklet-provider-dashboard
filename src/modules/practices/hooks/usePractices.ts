import { queryKeys } from '@/hooks/api/query-keys';
import { useQuery } from '@tanstack/react-query';
import { practicesService } from '../services/service';

export function usePractices() {
  return useQuery({
    queryKey: queryKeys.practices.list(),
    queryFn: () => practicesService.list(),
    staleTime: 5 * 60 * 1000,
  });
}
