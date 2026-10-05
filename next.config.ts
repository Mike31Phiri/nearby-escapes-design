import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
  // Direct API calls are enabled: browser hits backend directly
  async redirects() {
    return [
      {
        source: "/host/dashboard",
        destination: "/host",
        permanent: true,
      },
      {
        source: "/host/earnings",
        destination: "/host/finances",
        permanent: true,
      },
      {
        source: "/listings/create/:path*",
        destination: "/host/create",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;