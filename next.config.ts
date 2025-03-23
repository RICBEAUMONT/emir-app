import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true, // Required for static exports
  },
  experimental: {
    optimizeCss: true  // Enable CSS optimization
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
  }
};

export default nextConfig;
