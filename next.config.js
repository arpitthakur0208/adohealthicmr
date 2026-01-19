/** @type {import('next').NextConfig} */
const nextConfig = {
  // Suppress build errors in development
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
  // Improve error handling
  webpack: (config, { isServer }) => {
    // Ignore module resolution errors during development
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  // Suppress specific error types
  reactStrictMode: true,
  // Better error handling
  experimental: {
    // Reduce build errors
    optimizeCss: false,
  },
}

module.exports = nextConfig
