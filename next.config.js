/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/whats-left', // Replace with your repo name
  assetPrefix: '/whats-left/', // Replace with your repo name
}

module.exports = nextConfig 