/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@ninja-shop/shared'],
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.api.playstation.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
