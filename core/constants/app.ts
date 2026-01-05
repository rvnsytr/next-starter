export const appMeta = {
  name: "Next Starter",
  description: "App description...",
  keywords: ["next", "next starter"],

  lang: "id",

  // logo: {
  //   default: "/logo.png",
  //   withText: "/logo-text.png",
  // },
};

export const appConfig = {
  host: "http://localhost:8000",
  basePath: "/api",

  get baseUrl() {
    return `${this.host}${this.basePath}`;
  },

  get authBaseUrl() {
    return `${this.baseUrl}/auth`;
  },
};
