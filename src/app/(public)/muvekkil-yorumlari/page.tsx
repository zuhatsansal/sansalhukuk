import prisma from "@/lib/prisma";
import { Star } from "lucide-react";
import { getInitials } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Müvekkil Yorumları",
  description: "Şansal Hukuk Bürosu müvekkil yorumları ve referanslar.",
};

export default async function TestimonialsPage() {
  let testimonials: { id: string; name: string; rating: number; content: string }[] = [];
  try {
    testimonials = await prisma.testimonial.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, rating: true, content: true },
    });
  } catch {
    // DB not available
  }

  return (
    <>
      <section className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-gold text-sm font-semibold uppercase tracking-[3px]">Şansal Hukuk Bürosu</span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mt-3">Müvekkil Yorumları</h1>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white rounded-lg p-8 shadow-sm border border-gray-light">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={18} className={i < t.rating ? "text-gold fill-gold" : "text-gray-medium"} />
                  ))}
                </div>
                <p className="text-gray-dark/70 leading-relaxed mb-6">&ldquo;{t.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center">
                    <span className="text-gold font-bold text-sm">{getInitials(t.name)}</span>
                  </div>
                  <span className="font-medium text-primary">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
          {testimonials.length === 0 && (
            <p className="text-center text-gray-dark/50">Henüz yorum bulunmamaktadır.</p>
          )}
        </div>
      </section>
    </>
  );
}
