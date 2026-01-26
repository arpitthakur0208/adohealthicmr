/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Ignore module resolution errors during development
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
  // Ensure server-only modules are properly handled
  experimental: {
    serverComponentsExternalPackages: ['jsonwebtoken', 'bcryptjs', 'mongoose'],
  },
}

module.exports = nextConfig
