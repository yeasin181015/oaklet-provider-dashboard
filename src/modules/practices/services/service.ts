import { apiClient } from '@/lib/api-client';
import type { Practice } from '../types';

export const practicesService = {
  list(): Promise<{ data: Practice[] }> {
    return apiClient.get('/practices');
  },
};
