import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Plant registration/edits use Server Actions (FormData + image). Default is 1 MB.
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cyvoxtijyntxixeyghnm.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "cdn.weatherapi.com",
        pathname: "/weather/**",
      },
    ],
  },
};

export default nextConfig;
