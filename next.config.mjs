/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const nextConfig = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: {
    loader: 'custom',
    loaderFile: './lib/image-loader.js',
  },
};

export default nextConfig;
