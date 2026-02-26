export const API_ROUTES = {
  auth: {
    login: '/auth/login',
  },
  cases: {
    list: '/cases',
    getById: (id: string) => `/cases/${id}`,
    summary: '/cases/summary',
  }
};
