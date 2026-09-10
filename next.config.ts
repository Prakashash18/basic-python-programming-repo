import type { NextConfig } from "next";

/**
 * Every route in this app is prerendered, so it can be served either by a Node
 * host (Vercel's default) or as a folder of static files behind a CDN.
 *
 * `npm run build`         → .next, for Vercel / `next start`
 * `npm run build:static`  → out/,  for any static host (Render, Netlify, S3…)
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isStaticExport ? { output: "export" as const, images: { unoptimized: true } } : {}),
};

export default nextConfig;
