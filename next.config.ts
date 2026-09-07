import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep production verification separate from a running development server.
  distDir: process.env.ATOI_BUILD_DIR || ".next",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
