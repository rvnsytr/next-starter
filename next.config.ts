import { NextConfig } from "next";

const nextConfig: NextConfig = {
  // images: { remotePatterns: [new URL(`${process.env.S3_ENDPOINT}/**`)] },
  // experimental: {
  //   serverActions: {
  //     bodySizeLimit: `${Math.max(...Object.values(fileConfig).map(({ size }) => size.mb))}mb`,
  //   },
  // },
};

export default nextConfig;
