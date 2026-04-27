/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ninja-shop/shared'],
  compress: true,
  images: {
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.playstation.com',
      },
      {
        protocol: 'https',
        hostname: '**.psn.store',
      },
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com',
      },
      {
        protocol: 'https',
        hostname: '**.imgur.com',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: '**.akamaized.net',
      },
    ],
  },
}

export default nextConfig
