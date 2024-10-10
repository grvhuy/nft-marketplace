/** @type {import('next').NextConfig} */
const nextConfig = {
  crossOrigin: "anonymous",

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
