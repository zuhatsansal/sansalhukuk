export function generateLocalBusinessSchema(settings: Record<string, string>) {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "LegalService"],
    name: settings.site_title || "Şansal Hukuk Bürosu",
    description: settings.site_description || "Profesyonel hukuki danışmanlık hizmeti",
    url: "https://sansalhukuk.com",
    telephone: settings.phone || "",
    email: settings.email || "",
    address: {
      "@type": "PostalAddress",
      addressLocality: "İstanbul",
      addressCountry: "TR",
      streetAddress: settings.address || "",
    },
    ...(settings.working_hours && {
      openingHours: settings.working_hours,
    }),
    sameAs: [
      settings.instagram,
      settings.linkedin,
      settings.twitter,
      settings.facebook,
    ].filter(Boolean),
    priceRange: "$$",
  };
}

export function generateArticleSchema(article: {
  title: string;
  excerpt: string | null;
  publishedAt: Date | null;
  updatedAt: Date;
  coverImage: string | null;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt || "",
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    ...(article.coverImage && { image: article.coverImage }),
    author: {
      "@type": "Organization",
      name: "Şansal Hukuk Bürosu",
    },
    publisher: {
      "@type": "Organization",
      name: "Şansal Hukuk Bürosu",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://sansalhukuk.com/makaleler/${article.slug}`,
    },
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
