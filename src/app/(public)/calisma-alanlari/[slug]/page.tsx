import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const area = await prisma.practiceArea.findUnique({
      where: { slug },
      select: { title: true, metaTitle: true, metaDesc: true, shortDesc: true },
    });
    if (!area) return { title: "Bulunamadı" };
    return {
      title: area.metaTitle || area.title,
      description: area.metaDesc || area.shortDesc || "",
    };
  } catch {
    return { title: "Çalışma Alanı" };
  }
}

export default async function PracticeAreaDetailPage({ params }: Props) {
  const { slug } = await params;
  let area;
  let otherAreas: { slug: string; title: string }[] = [];

  try {
    area = await prisma.practiceArea.findUnique({ where: { slug } });
    otherAreas = await prisma.practiceArea.findMany({
      where: { published: true, slug: { not: slug } },
      orderBy: { sortOrder: "asc" },
      select: { slug: true, title: true },
    });
  } catch {
    notFound();
  }

  if (!area) notFound();

  return (
    <>
      <section className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-gold text-sm font-semibold uppercase tracking-[3px]">Çalışma Alanlarımız</span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mt-3">{area.title}</h1>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main content */}
            <div className="lg:col-span-3">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: area.content || "" }}
              />

              {/* CTA */}
              <div className="mt-12 bg-primary rounded-lg p-8 text-center">
                <h3 className="font-heading text-2xl font-bold text-white mb-3">
                  Bu alanda hukuki desteğe mi ihtiyacınız var?
                </h3>
                <p className="text-white/70 mb-6">
                  Uzman avukat kadromuz ile yanınızdayız.
                </p>
                <Link
                  href="/iletisim"
                  className="inline-flex bg-gold hover:bg-gold-dark text-white px-8 py-3 rounded-md font-medium transition-colors"
                >
                  İletişime Geçin
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-light rounded-lg p-6 sticky top-24">
                <h3 className="font-heading text-lg font-bold text-primary mb-4">
                  Diğer Çalışma Alanları
                </h3>
                <ul className="space-y-2">
                  {otherAreas.map((other) => (
                    <li key={other.slug}>
                      <Link
                        href={`/calisma-alanlari/${other.slug}`}
                        className="block py-2 px-3 rounded text-sm text-gray-dark/70 hover:text-gold hover:bg-gold/5 transition-colors"
                      >
                        {other.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
