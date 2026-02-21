import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Calendar, User, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const article = await prisma.article.findUnique({
      where: { slug },
      select: { title: true, metaTitle: true, metaDesc: true, excerpt: true, coverImage: true },
    });
    if (!article) return { title: "Bulunamadı" };
    return {
      title: article.metaTitle || article.title,
      description: article.metaDesc || article.excerpt || "",
      openGraph: {
        title: article.title,
        description: article.excerpt || "",
        ...(article.coverImage && { images: [article.coverImage] }),
      },
    };
  } catch {
    return { title: "Makale" };
  }
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  let article;
  let relatedArticles: { slug: string; title: string; publishedAt: Date | null }[] = [];

  try {
    article = await prisma.article.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (article) {
      // Increment view count
      await prisma.article.update({
        where: { id: article.id },
        data: { viewCount: { increment: 1 } },
      });

      relatedArticles = await prisma.article.findMany({
        where: {
          published: true,
          id: { not: article.id },
          ...(article.categoryId ? { categoryId: article.categoryId } : {}),
        },
        orderBy: { publishedAt: "desc" },
        take: 3,
        select: { slug: true, title: true, publishedAt: true },
      });
    }
  } catch {
    notFound();
  }

  if (!article) notFound();

  return (
    <>
      <section className="bg-primary py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {article.category && (
            <span className="text-gold text-sm font-semibold uppercase tracking-[3px]">
              {article.category.name}
            </span>
          )}
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-3">
            {article.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-white/60 text-sm mt-6">
            <span className="flex items-center gap-1">
              <User size={14} />
              Şansal Hukuk Bürosu
            </span>
            {article.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {formatDate(article.publishedAt)}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            href="/makaleler"
            className="inline-flex items-center gap-2 text-gold hover:text-gold-dark mb-8 text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Tüm Makaleler
          </Link>

          {/* Article Content */}
          <article
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Share */}
          <div className="border-t border-gray-medium/30 mt-12 pt-8">
            <p className="text-sm text-gray-dark/50 mb-3">Bu makaleyi paylaşın:</p>
            <div className="flex gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`/makaleler/${article.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-light rounded text-sm text-gray-dark hover:bg-gold/10 transition-colors"
              >
                Twitter
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`/makaleler/${article.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-light rounded text-sm text-gray-dark hover:bg-gold/10 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(article.title + " " + `/makaleler/${article.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-light rounded text-sm text-gray-dark hover:bg-gold/10 transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="mt-12">
              <h3 className="font-heading text-2xl font-bold text-primary mb-6">İlgili Makaleler</h3>
              <div className="space-y-3">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/makaleler/${related.slug}`}
                    className="block p-4 bg-gray-light rounded-lg hover:bg-gold/5 transition-colors"
                  >
                    <h4 className="font-medium text-primary hover:text-gold transition-colors">{related.title}</h4>
                    {related.publishedAt && (
                      <p className="text-sm text-gray-dark/40 mt-1">{formatDate(related.publishedAt)}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
