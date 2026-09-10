import type { NextConfig } from "next";

/**
 * Every route in this app is prerendered, so it can be served by a Node host
 * (Vercel's default) or as a folder of static files behind any CDN.
 *
 *   npm run build         → .next, for Vercel / `next start`
 *   npm run build:static  → out/,  for any static host (Render, Netlify, S3…)
 *   npm run build:pages   → out/,  for GitHub Pages
 *
 * GitHub Pages serves a project site from https://<user>.github.io/<repo>/, so
 * every asset and link needs that prefix. BASE_PATH carries it; the Actions
 * workflow sets it from the repository name. Leave it empty for a user site or
 * a custom domain, where the app sits at the root.
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  ...(isStaticExport
    ? {
        output: "export" as const,
        images: { unoptimized: true },
        // Emit out/topic/lists/index.html rather than out/topic/lists.html, so
        // plain file servers resolve extensionless URLs without special rules.
        trailingSlash: true,
      }
    : {}),
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
