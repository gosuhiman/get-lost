import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Handle GitHub Pages path prefix correctly
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
