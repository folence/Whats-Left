/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/Whats-Left',  // Note the capital 'L'
  assetPrefix: '/Whats-Left/',  // Note the capital 'L'
  trailingSlash: true,
}

module.exports = nextConfig 