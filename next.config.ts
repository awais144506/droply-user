/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io', // (Keep for backwards compatibility with your old test images)
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.ufs.sh', // 🔥 Trust all UploadThing App ID domains
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;