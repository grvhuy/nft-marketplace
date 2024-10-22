/** @type {import('next').NextConfig} */
const nextConfig = {
  crossOrigin: "anonymous",
  images: {
    domains: ["scontent.fsgn19-1.fna.fbcdn.net", "cdn.animaapp.com"],
    remotePatterns: [
      {
        hostname: "pqxhavcshlsgvyjmkhkv.supabase.co",
      },

      {
        hostname: "pqxhavcshlsgvyjmkhkv.supabase.co",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api-kodansa.tqbaoo.host/api/:path*",
      },
      {
        source: "/api/:path*",
        destination: "https://cblue-wonderful-antelope-164.mypinata.cloud/:path*",
      },
    ];
  },
};

export default nextConfig;
