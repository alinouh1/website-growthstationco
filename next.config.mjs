
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/website-growthstationco",
  trailingSlash: true,

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
