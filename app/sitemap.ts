import type { MetadataRoute } from "next";
import { topics } from "@/lib/curriculum";

export const dynamic = "force-static";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://basic-python-programming.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/teach", "/practice", "/playground"].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const topicPages = topics.flatMap((t) => [
    { url: `${BASE}/topic/${t.slug}`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${BASE}/topic/${t.slug}/practice`, changeFrequency: "monthly" as const, priority: 0.6 },
  ]);

  return [...staticPages, ...topicPages];
}
