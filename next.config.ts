import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["vnhm1ui6mh.ufs.sh", "utfs.io", "res.cloudinary.com"],
  },
  eslint: {
    ignoreDuringBuilds: true, 
  },
};

export default nextConfig;
