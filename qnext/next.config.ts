// next.config.ts
import { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    domains: [
      'lh3.googleusercontent.com',
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
      allowedOrigins: ['localhost:3000'],
    },
  },
};

export default config;