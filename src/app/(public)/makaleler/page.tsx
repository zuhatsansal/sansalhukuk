import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatDate, truncate } from "@/lib/utils";
import { Calendar, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Makaleler",
  description: "Şansal Hukuk Bürosu blog ve makaleler. Hukuki gelişmeler, bilgilendirici yazılar.",
};

interface Props {
  searchParams: Promise<{ page?: string; category?: string }>;
}

export default async function ArticlesPage({ searchParams }: Props) {
  const { page = "1", category } = await searchParams;
  const currentPage = parseInt(page) || 1;
  const perPage = 9;

  let articles: {
    id: string; title: string; slug: string; excerpt: string | null;
    coverImage: string | null; publishedAt: Date | null;
    category: { name: string; slug: string } | null;
  }[] = [];
  let total = 0;
  let categories: { id: string; name: string; slug: string }[] = [];

  try {
    const where = {
      published: true,
      ...(category ? { category: { slug: category } } : {}),
    };

    [articles, total, categories] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (currentPage - 1) * perPage,
        take: perPage,
        select: {
          id: true, title: true, slug: true, excerpt: true,
          coverImage: true, publishedAt: true,
          category: { select: { name: true, slug: true } },
        },
      }),
      prisma.article.count({ where }),
      prisma.category.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, slug: true },
      }),
    ]);
  } catch {
    // DB not available
  }

  const totalPages = Math.ceil(total / perPage);

  return (
    <>
      <section className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-gold text-sm font-semibold uppercase tracking-[3px]">Şansal Hukuk Bürosu</span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mt-3">Makaleler</h1>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10 justify-center">
              <Link
                href="/makaleler"
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  !category ? "bg-gold text-white" : "bg-gray-light text-gray-dark hover:bg-gold/10"
                }`}
              >
                Tümü
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/makaleler?category=${cat.slug}`}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    category === cat.slug ? "bg-gold text-white" : "bg-gray-light text-gray-dark hover:bg-gold/10"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link key={article.id} href={`/makaleler/${article.slug}`}>
                <article className="bg-white rounded-lg overflow-hidden border border-gray-light hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  <div className="aspect-video bg-gray-light flex items-center justify-center">
                    {article.coverImage ? (
                      <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-primary/20 font-heading">Makale Görseli</span>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    {article.category && (
                      <span className="text-gold text-xs font-semibold uppercase tracking-wider mb-2">
                        {article.category.name}
                      </span>
                    )}
                    <h3 className="font-heading text-lg font-bold text-primary mb-3 hover:text-gold transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-dark/60 text-sm leading-relaxed mb-4 flex-1">
                      {truncate(article.excerpt || "", 150)}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      {article.publishedAt && (
                        <span className="flex items-center gap-1 text-gray-dark/40">
                          <Calendar size={14} />
                          {formatDate(article.publishedAt)}
                        </span>
                      )}
                      <span className="text-gold font-medium flex items-center gap-1">
                        Devamını Oku <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/makaleler?page=${p}${category ? `&category=${category}` : ""}`}
                  className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium transition-colors ${
                    p === currentPage ? "bg-gold text-white" : "bg-gray-light text-gray-dark hover:bg-gold/10"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}

          {articles.length === 0 && (
            <p className="text-center text-gray-dark/50 py-12">Henüz makale bulunmamaktadır.</p>
          )}
        </div>
      </section>
    </>
  );
}
