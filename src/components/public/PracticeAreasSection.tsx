"use client";

import Link from "next/link";
import AnimatedSection from "./AnimatedSection";
import SectionTitle from "@/components/ui/SectionTitle";
import {
  Heart,
  Shield,
  FileText,
  Home,
  Building,
  Landmark,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Heart,
  Shield,
  FileText,
  Home,
  Building,
  Landmark,
};

interface PracticeArea {
  id: string;
  title: string;
  slug: string;
  icon: string | null;
  shortDesc: string | null;
}

interface PracticeAreasSectionProps {
  areas: PracticeArea[];
}

export default function PracticeAreasSection({
  areas,
}: PracticeAreasSectionProps) {
  return (
    <section className="py-20 bg-gray-light">
      <div className="max-w-7xl mx-auto px-4">
        <AnimatedSection>
          <SectionTitle
            subtitle="Şansal Hukuk Bürosu"
            title="Çalışma Alanlarımız"
            description="Geniş bir hukuk yelpazesinde uzman kadromuzla yanınızdayız."
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {areas.map((area, index) => {
            const Icon = iconMap[area.icon || "FileText"] || FileText;

            return (
              <AnimatedSection key={area.id} delay={index * 0.1}>
                <Link href={`/calisma-alanlari/${area.slug}`}>
                  <div className="bg-white rounded-lg p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group h-full">
                    <div className="w-16 h-16 bg-gold/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                      <Icon size={32} className="text-gold" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-primary mb-3 group-hover:text-gold transition-colors">
                      {area.title}
                    </h3>
                    <p className="text-gray-dark/60 leading-relaxed text-sm">
                      {area.shortDesc}
                    </p>
                  </div>
                </Link>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
