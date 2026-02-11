export const appMeta = {
  name: "Next Starter",
  description: "App description...",
  keywords: ["next", "next starter"],

  lang: "id",

  // logo: {
  //   default: "/logo.png",
  //   withText: "/logo-text.png",
  // },

  url: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
};

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
