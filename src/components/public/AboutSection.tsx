"use client";

import Link from "next/link";
import AnimatedSection from "./AnimatedSection";
import { Scale, ArrowRight } from "lucide-react";

interface AboutSectionProps {
  text?: string;
}

export default function AboutSection({
  text = "Av. Mehmet Zuhat Şansal tarafından kurulan hukuk büromuz, müvekkillerine kaliteli, güvenilir ve şeffaf hukuki danışmanlık hizmeti sunmaktadır.",
}: AboutSectionProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image/Logo */}
          <AnimatedSection direction="left">
            <div className="relative">
              <div className="bg-gray-light rounded-lg aspect-square flex items-center justify-center">
                <div className="text-center">
                  <Scale className="text-gold mx-auto mb-4" size={80} />
                  <span className="font-heading text-3xl font-bold text-primary block">
                    ŞANSAL
                  </span>
                  <span className="text-gold text-sm tracking-[4px] uppercase">
                    Hukuk Bürosu
                  </span>
                </div>
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gold/10 rounded-lg -z-10" />
            </div>
          </AnimatedSection>

          {/* Right: Content */}
          <AnimatedSection direction="right">
            <span className="text-gold text-sm font-semibold uppercase tracking-[3px]">
              Şansal Hukuk Bürosu
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary mt-3 mb-6">
              Hakkımızda
            </h2>
            <div className="w-16 h-0.5 bg-gold mb-6" />
            <p className="text-gray-dark/70 text-lg leading-relaxed mb-6">
              {text}
            </p>
            <p className="text-gray-dark/70 leading-relaxed mb-8">
              Geniş bir hukuki yelpazede uzmanlaşmış kadromuzla, her
              müvekkilimize özel çözümler üretiyoruz. Hukuki süreçlerinizde
              yanınızda olarak haklarınızı en etkin şekilde korumayı
              amaçlıyoruz.
            </p>
            <Link
              href="/hakkimizda"
              className="inline-flex items-center gap-2 text-gold hover:text-gold-dark font-medium transition-colors"
            >
              Devamını Oku
              <ArrowRight size={18} />
            </Link>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
