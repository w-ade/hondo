import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @hondo/* ship raw TypeScript from src/ — Next has to compile them.
  transpilePackages: ["@hondo/core", "@hondo/ui"],
};

export default nextConfig;
