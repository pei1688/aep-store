import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["vnhm1ui6mh.ufs.sh", "utfs.io", "res.cloudinary.com"],
  },
};

export default withBundleAnalyzer(nextConfig);
