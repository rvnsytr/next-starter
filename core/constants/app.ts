export const appMeta = {
  name: "Next Starter",
  description: "App description...",
  keywords: ["next", "next starter"],

  // logo: {
  //   default: "/logo.png",
  //   withText: "/logo-text.png",
  // },

  lang: "id",

  apiHost:
    process.env.NODE_ENV === "production"
      ? "https://apidomain.example/api/v1"
      : "http://localhost:8000/api/v1",
};
