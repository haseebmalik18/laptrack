import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true, // Enable gzip compression
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true, // Temporary for demo
  },
  eslint: {
    ignoreDuringBuilds: true, // Temporary for demo
  },
};

export default nextConfig;
