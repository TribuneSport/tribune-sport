import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "crests.football-data.org",
      },
      {
        protocol: "https",
        hostname: "i.f1g.fr",
      },
      {
        protocol: "https",
        hostname: "ichef.bbci.co.uk",
      },
      {
        protocol: "https",
        hostname: "media.guim.co.uk",
      },
      {
        protocol: "https",
        hostname: "img.uefa.com",
      },
    ],
  },
};

export default nextConfig;