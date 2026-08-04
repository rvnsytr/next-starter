import { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  cacheComponents: true,
  partialPrefetching: true,

  images: {
    remotePatterns: [
      new URL(`${process.env.S3_ENDPOINT}/**`),
      new URL(`${process.env.S3_PUBLIC_ENDPOINT}/**`),
    ],
  },

  experimental: {
    // serverActions: { bodySizeLimit: "5mb" },
    useTypeScriptCli: true,
  },
};

export default nextConfig;
