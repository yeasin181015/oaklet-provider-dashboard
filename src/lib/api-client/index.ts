/**
 * API Client
 *
 * Thin HTTP wrapper that mirrors the Oaklet API contract.
 * Swap NEXT_PUBLIC_API_BASE_URL to point at a real backend and
 * the rest of the application requires zero changes.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
const PREFIX = process.env.NEXT_PUBLIC_API_PREFIX ?? '/api';
const VERSION = process.env.NEXT_PUBLIC_API_VERSION ?? '/v1';
const TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT ?? 30_000);

function buildUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${PREFIX}${VERSION}${normalizedPath}`;
}

async function getAuthHeader(): Promise<Record<string, string>> {
  if (typeof window === 'undefined') {
    // Server-side: use auth() from the NextAuth config.
    // Dynamic import breaks the potential circular dep at module-init time.
    // During the authorize() callback auth() returns null — correct, login needs no token.
    try {
      const { auth } = await import('@/auth');
      const session = await auth();
      if (session?.accessToken) {
        return { Authorization: `Bearer ${session.accessToken}` };
      }
    } catch {
      // auth not resolvable in this context (e.g. during authorize callback)
    }
    return {};
  }

  // Client-side: next-auth/react is browser-only.
  try {
    const { getSession } = await import('next-auth/react');
    const session = await getSession();
    if (session?.accessToken) {
      return { Authorization: `Bearer ${session.accessToken}` };
    }
  } catch {
    // No session available
  }
  return {};
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  token?: string; // For server-side calls where getSession isn't available
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, token, ...rest } = options;

  const authHeader = token ? { Authorization: `Bearer ${token}` } : await getAuthHeader();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const res = await fetch(buildUrl(path), {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...authHeader,
        ...rest.headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const json = await res.json();

    if (!res.ok) {
      throw new ApiClientError(res.status, json?.error?.code ?? 'UNKNOWN', json?.error?.message ?? 'Request failed');
    }

    return json as T;
  } finally {
    clearTimeout(timer);
  }
}

export class ApiClientError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isNotFound() {
    return this.status === 404;
  }
}

export const apiClient = {
  get<T>(path: string, options?: Omit<RequestOptions, 'body' | 'method'>) {
    return request<T>(path, { ...options, method: 'GET' });
  },

  post<T>(path: string, body: unknown, options?: Omit<RequestOptions, 'body' | 'method'>) {
    return request<T>(path, { ...options, method: 'POST', body });
  },

  put<T>(path: string, body: unknown, options?: Omit<RequestOptions, 'body' | 'method'>) {
    return request<T>(path, { ...options, method: 'PUT', body });
  },

  patch<T>(path: string, body: unknown, options?: Omit<RequestOptions, 'body' | 'method'>) {
    return request<T>(path, { ...options, method: 'PATCH', body });
  },

  delete<T>(path: string, options?: Omit<RequestOptions, 'body' | 'method'>) {
    return request<T>(path, { ...options, method: 'DELETE' });
  },
};
