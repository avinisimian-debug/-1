import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  serverExternalPackages: ["ffmpeg-static", "fluent-ffmpeg"],
  experimental: {
    proxyClientMaxBodySize: 520 * 1024 * 1024,
  },
};

export default nextConfig;
