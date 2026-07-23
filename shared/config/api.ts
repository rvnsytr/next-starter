export const apiConfig = {
  host:
    process.env.NODE_ENV === "production"
      ? "https://api.yourdomain.com"
      : "http://localhost:8000",

  basePath: "/api",

  get baseUrl() {
    return `${this.host}${this.basePath}`;
  },
};
