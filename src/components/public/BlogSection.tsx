"use client";

import Link from "next/link";
import AnimatedSection from "./AnimatedSection";
import SectionTitle from "@/components/ui/SectionTitle";
import { formatDate, truncate } from "@/lib/utils";
import { Calendar, ArrowRight } from "lucide-react";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
  category: { name: string; slug: string } | null;
}

interface BlogSectionProps {
  articles: Article[];
}

export default function BlogSection({ articles }: BlogSectionProps) {
  if (articles.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <AnimatedSection>
          <SectionTitle
            subtitle="Şansal Hukuk Bürosu"
            title="Blog & Makaleler"
            description="Hukuki gelişmeler ve bilgilendirici makaleler."
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {articles.map((article, index) => (
            <AnimatedSection key={article.id} delay={index * 0.15}>
              <Link href={`/makaleler/${article.slug}`}>
                <article className="bg-gray-light rounded-lg overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  {/* Cover Image */}
                  <div className="aspect-video bg-primary/5 flex items-center justify-center">
                    {article.coverImage ? (
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-primary/20 font-heading text-lg">
                        Makale Görseli
                      </span>
                    )}
                  </div>
                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    {article.category && (
                      <span className="text-gold text-xs font-semibold uppercase tracking-wider mb-2">
                        {article.category.name}
                      </span>
                    )}
                    <h3 className="font-heading text-lg font-bold text-primary mb-3 group-hover:text-gold transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-dark/60 text-sm leading-relaxed mb-4 flex-1">
                      {truncate(article.excerpt || "", 120)}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      {article.publishedAt && (
                        <span className="flex items-center gap-1 text-gray-dark/40">
                          <Calendar size={14} />
                          {formatDate(article.publishedAt)}
                        </span>
                      )}
                      <span className="text-gold font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        Devamını Oku
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </AnimatedSection>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/makaleler"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-8 py-3 rounded-md font-medium transition-colors"
          >
            Tüm Makaleler
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
