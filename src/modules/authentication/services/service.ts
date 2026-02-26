import { apiClient } from '@/lib/api-client';
import { API_ROUTES } from '@/lib/routes/api-routes';
import type { LoginCredentials, LoginResponse } from '../types';

export const authService = {
  login(credentials: LoginCredentials): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>(API_ROUTES.auth.login, credentials);
  },
};
