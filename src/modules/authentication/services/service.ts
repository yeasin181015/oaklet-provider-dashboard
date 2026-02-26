import type { LoginCredentials, LoginResponse } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const json = await res.json();

    if (!res.ok) {
      throw new Error(json?.error?.message ?? 'Login failed');
    }

    return json as LoginResponse;
  },
};
