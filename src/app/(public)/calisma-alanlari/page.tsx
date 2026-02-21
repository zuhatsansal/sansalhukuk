import Link from "next/link";
import prisma from "@/lib/prisma";
import SectionTitle from "@/components/ui/SectionTitle";
import {
  Heart, Shield, FileText, Home, Building, Landmark,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Çalışma Alanlarımız",
  description: "Şansal Hukuk Bürosu çalışma alanları. Aile hukuku, ceza hukuku, miras hukuku ve daha fazlası.",
};

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Heart, Shield, FileText, Home, Building, Landmark,
};

export default async function PracticeAreasPage() {
  let areas: { id: string; title: string; slug: string; icon: string | null; shortDesc: string | null }[] = [];
  try {
    areas = await prisma.practiceArea.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, title: true, slug: true, icon: true, shortDesc: true },
    });
  } catch {
    // DB not available
  }

  return (
    <>
      <section className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-gold text-sm font-semibold uppercase tracking-[3px]">Şansal Hukuk Bürosu</span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mt-3">Çalışma Alanlarımız</h1>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {areas.map((area) => {
              const Icon = iconMap[area.icon || "FileText"] || FileText;
              return (
                <Link key={area.id} href={`/calisma-alanlari/${area.slug}`}>
                  <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group h-full border border-gray-light">
                    <div className="w-16 h-16 bg-gold/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                      <Icon size={32} className="text-gold" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-primary mb-3 group-hover:text-gold transition-colors">
                      {area.title}
                    </h3>
                    <p className="text-gray-dark/60 leading-relaxed text-sm">{area.shortDesc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
