import type { ProviderPractice } from '@/modules/authentication/types';
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      name: string;
      firstName: string;
      lastName: string;
      role: string;
      practices: ProviderPractice[];
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    firstName: string;
    lastName: string;
    role: string;
    practices: ProviderPractice[];
    accessToken: string;
    refreshToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    userId: string;
    firstName: string;
    lastName: string;
    role: string;
    practices: ProviderPractice[];
  }
}
