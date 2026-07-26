import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dename-agricultural.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: "/",         priority: 1.0, changeFrequency: "weekly"  },
    { url: "/about",    priority: 0.8, changeFrequency: "monthly" },
    { url: "/products", priority: 0.9, changeFrequency: "daily"   },
    { url: "/contact",  priority: 0.8, changeFrequency: "monthly" },
    { url: "/gallery",  priority: 0.5, changeFrequency: "monthly" },
    { url: "/auth/login",    priority: 0.3, changeFrequency: "yearly" },
    { url: "/auth/register", priority: 0.3, changeFrequency: "yearly" as const },
    { url: "/terms",           priority: 0.3, changeFrequency: "yearly" as const },
    { url: "/privacy",         priority: 0.3, changeFrequency: "yearly" as const },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = [
    "ginger", "coffee", "rosemary", "turmeric",
    "garlic", "cardamom", "black-pepper", "honey",
  ].map((slug) => ({
    url: `/products/${slug}`,
    priority: 0.9,
    changeFrequency: "weekly" as const,
  }));

  return [...staticRoutes, ...categoryRoutes].map((route) => ({
    ...route,
    url: `${baseUrl}${route.url}`,
    lastModified: new Date(),
  }));
}
