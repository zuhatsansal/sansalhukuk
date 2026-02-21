import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

const BASE_URL = process.env.NEXTAUTH_URL || "https://sansalhukuk.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${BASE_URL}/hakkimizda`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/calisma-alanlari`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/ekibimiz`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/makaleler`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/iletisim`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/sss`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${BASE_URL}/muvekkil-yorumlari`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  let dynamicPages: MetadataRoute.Sitemap = [];

  try {
    const [articles, practiceAreas] = await Promise.all([
      prisma.article.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.practiceArea.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    dynamicPages = [
      ...articles.map((article) => ({
        url: `${BASE_URL}/makaleler/${article.slug}`,
        lastModified: article.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...practiceAreas.map((area) => ({
        url: `${BASE_URL}/calisma-alanlari/${area.slug}`,
        lastModified: area.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    ];
  } catch {
    // DB not available, return only static pages
  }

  return [...staticPages, ...dynamicPages];
}
