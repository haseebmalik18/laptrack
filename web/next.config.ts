import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  compress: true, // Enable gzip compression
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true, // Temporary for demo
  },
  experimental: {
    turbo: {
      resolveAlias: {
        "@analysis": path.resolve(__dirname, "../src/analysis"),
        "@types": path.resolve(__dirname, "../src/types"),
      },
    },
  },
};

export default nextConfig;
