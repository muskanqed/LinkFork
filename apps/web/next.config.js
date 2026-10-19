/* eslint-env node */
/* eslint-disable no-undef */
/* eslint-disable turbo/no-undeclared-env-vars */
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.INTERNAL_API_URL || 'http://localhost:5000'}/:path*`,
      },
    ];
  },
};

export default nextConfig;
