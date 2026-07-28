import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 blocks dev requests from origins it does not recognise, so viewing
  // the dev server from a phone on the LAN 404s without this.
  allowedDevOrigins: ["192.168.1.135", "*.local"],
};

export default nextConfig;
