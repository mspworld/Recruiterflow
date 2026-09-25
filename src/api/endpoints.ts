export const endpoints = {
  users: {
    collection: '/api/users',
    byId: (id: number | string) => `/api/users/${id}`,
  },
} as const;
