import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  outputFileTracingIncludes: {
    "/api/transcribe": [
      "./data/pro-grants.json",
      "./node_modules/ffmpeg-static/**/*",
      "./node_modules/youtube-dl-exec/bin/**/*",
    ],
    "/api/transcribe/**/*": [
      "./data/pro-grants.json",
      "./node_modules/ffmpeg-static/**/*",
      "./node_modules/youtube-dl-exec/bin/**/*",
    ],
    "/**/*": ["./data/pro-grants.json"],
  },
  serverExternalPackages: ["ffmpeg-static", "fluent-ffmpeg", "youtube-dl-exec"],
  experimental: {
    proxyClientMaxBodySize: 520 * 1024 * 1024,
  },
};

export default nextConfig;
