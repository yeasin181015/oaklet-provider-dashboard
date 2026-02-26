import { apiClient } from '@/lib/api-client';
import type { LoginCredentials, LoginResponse } from '../types';

export const authService = {
  login(credentials: LoginCredentials): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login', credentials);
  },
};
