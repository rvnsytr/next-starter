export const AUTH_QUERY_KEYS = {
  /** @path `/users`. */
  users: "/users",

  /** @path `/sessions`. */
  sessions: "/sessions",

  /** @path `/sessions/:id`. */
  "sessions:id": (id: string) => `/sessions/${id}`,
};
