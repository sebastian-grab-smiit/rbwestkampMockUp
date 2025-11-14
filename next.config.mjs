// next.config.mjs
const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for GitHub Pages (static hosting)
  output: 'export',

  // Project page under /<repo>
  basePath: '',
  assetPrefix: '',

  // Helps avoid 404s on deep-link refreshes
  trailingSlash: true,

  // Your existing settings
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  devIndicators: false,
};

export default nextConfig;
