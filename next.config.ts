import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['media.istockphoto.com', 'avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  },
  // Add this to ensure proper routing
  trailingSlash: false,
  // Add this to help with debugging
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      const originalEntry = config.entry
      config.entry = async () => {
        const entries = await originalEntry()
        if (entries['main.js'] && !entries['main.js'].includes('./src/client/dev-error-overlay.js')) {
          entries['main.js'].unshift('./src/client/dev-error-overlay.js')
        }
        return entries
      }
    }
    return config
  },
}

export default nextConfig