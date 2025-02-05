import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

// next.config.js
module.exports = {
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint during the build process
  },
};

