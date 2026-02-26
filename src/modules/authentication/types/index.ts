export interface ProviderPractice {
  practice_id: string;
  name: string;
  role: string;
}

export interface Provider {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  practices: ProviderPractice[];
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface LoginResponse extends AuthTokens {
  provider: Provider;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
