import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  outputFileTracingIncludes: {
    "/api/transcribe": [
      "./data/pro-grants.json",
      "./node_modules/ffmpeg-static/**/*",
    ],
    "/api/transcribe/**/*": [
      "./data/pro-grants.json",
      "./node_modules/ffmpeg-static/**/*",
    ],
    "/**/*": ["./data/pro-grants.json"],
  },
  serverExternalPackages: ["ffmpeg-static", "fluent-ffmpeg"],
  experimental: {
    proxyClientMaxBodySize: 520 * 1024 * 1024,
  },
};

export default nextConfig;
