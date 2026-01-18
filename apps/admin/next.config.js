const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@azalea/shared', '@azalea/ui', '@azalea/sections'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.convex.cloud',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@convex': path.resolve(__dirname, '../../convex'),
    };
    return config;
  },
};

module.exports = nextConfig;
