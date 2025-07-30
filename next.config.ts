import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/repo-input',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
