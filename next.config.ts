import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@relio/crm-sdk'],
  poweredByHeader: false,
};

export default nextConfig;
