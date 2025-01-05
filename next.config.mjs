/** @type {import('next').NextConfig} */
const nextConfig = {
  crossOrigin: "anonymous",
  images: {
    domains: [],
    remotePatterns: [
      {
        hostname: "pqxhavcshlsgvyjmkhkv.supabase.co",
      },

      {
        hostname: "pqxhavcshlsgvyjmkhkv.supabase.co",
      },
      {
        hostname: "blue-wonderful-antelope-164.mypinata.cloud",
      },
      {
        hostname: "jade-legislative-fowl-319.mypinata.cloud",
      },
      {
        hostname: "scontent.fsgn19-1.fna.fbcdn.net", 
      },
      {
        hostname: "cdn.animaapp.com",
      }
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
      {
        source: "/api/:path*",
        destination: "https://jade-legislative-fowl-319.mypinata.cloud/:path*",
      },


    ];
  },
};

export default nextConfig;
