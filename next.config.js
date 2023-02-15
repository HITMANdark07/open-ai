/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    OPEN_AI_API_KEY: process.env.OPEN_AI_API_KEY,
  },
};

module.exports = nextConfig;
