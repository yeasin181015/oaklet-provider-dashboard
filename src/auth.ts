import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { LoginResponse } from './modules/authentication/types';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) return null;

          const data: LoginResponse = await res.json();

          return {
            id: data.provider.id,
            email: data.provider.email,
            name: `${data.provider.first_name} ${data.provider.last_name}`,
            firstName: data.provider.first_name,
            lastName: data.provider.last_name,
            role: data.provider.role,
            practices: data.provider.practices,
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.userId = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
        token.practices = user.practices;
      }
      return token;
    },
    async session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const t = token as any;
      session.accessToken = t.accessToken as string;
      session.refreshToken = t.refreshToken as string;
      session.user.id = t.userId as string;
      session.user.firstName = t.firstName as string;
      session.user.lastName = t.lastName as string;
      session.user.role = t.role as string;
      session.user.practices = t.practices;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
});
