/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { typedRoutes: true },
  images: { 
    remotePatterns: [{ protocol: "https", hostname: "*" }],
    unoptimized: false,
  },
  webpack: (config, { isServer }) => {
    // Fix for react-notion-x SSR issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;

