/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/whats-left', // Must match your repository name exactly
  assetPrefix: '/whats-left/', // Must match your repository name exactly
  trailingSlash: true,
}

module.exports = nextConfig 