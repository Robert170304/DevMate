import type { NextConfig } from "next";
import path from 'node:path';

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {
    implementation: 'sass-embedded',
    additionalData: `@use "${path.join(process.cwd(), '_mantine').replace(/\\/g, '/')}" as mantine;`,
  },
  images: {
    domains: ['robohash.org'],
  },
};

export default nextConfig;
