export const APP_ROUTES = {
  auth: {
    login: '/login',
  },
  dashboard: '/dashboard',
  cases: {
    list: '/dashboard/cases',
    detail: (id: string) => `/dashboard/cases/${id}`,
  },
} as const;
