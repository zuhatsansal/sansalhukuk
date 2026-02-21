import prisma from "@/lib/prisma";
import FAQAccordion from "@/components/public/FAQAccordion";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sıkça Sorulan Sorular",
  description: "Şansal Hukuk Bürosu sıkça sorulan sorular. Avukatlık hizmetleri hakkında merak edilenler.",
};

export default async function FAQPage() {
  let faqs: { id: string; question: string; answer: string }[] = [];
  try {
    faqs = await prisma.fAQ.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, question: true, answer: true },
    });
  } catch {
    // DB not available
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-gold text-sm font-semibold uppercase tracking-[3px]">Şansal Hukuk Bürosu</span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mt-3">Sıkça Sorulan Sorular</h1>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          {faqs.length > 0 ? (
            <FAQAccordion faqs={faqs} />
          ) : (
            <p className="text-center text-gray-dark/50">Henüz soru eklenmemiştir.</p>
          )}
        </div>
      </section>
    </>
  );
}
