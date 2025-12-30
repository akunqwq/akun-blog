/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['tsx', 'ts', 'mdx', 'md'],
  experimental: {
    mdxRs: {
      mdxType: 'gfm', // 启用 GitHub 风格 Markdown 支持
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'someacg.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'cdn.someacg.top',
      }
    ]
  }
};

export default nextConfig;
