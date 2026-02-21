"use client";

import AnimatedSection from "./AnimatedSection";
import SectionTitle from "@/components/ui/SectionTitle";
import { MessageSquare, Search, Target } from "lucide-react";

interface ProcessStep {
  title: string;
  description: string;
}

interface ProcessSectionProps {
  steps?: ProcessStep[];
}

const defaultSteps: ProcessStep[] = [
  {
    title: "İlk Görüşme",
    description:
      "Hukuki sorununuzu dinliyor, durumu değerlendiriyor ve size en uygun çözüm yolunu belirliyoruz.",
  },
  {
    title: "Dava Değerlendirme",
    description:
      "Davanızı detaylı olarak analiz ediyor, başarı şansını değerlendiriyor ve strateji oluşturuyoruz.",
  },
  {
    title: "Hukuki Strateji",
    description:
      "Size özel hazırlanan hukuki strateji ile haklarınızı en etkin şekilde koruyoruz.",
  },
];

const icons = [MessageSquare, Search, Target];

export default function ProcessSection({
  steps = defaultSteps,
}: ProcessSectionProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <AnimatedSection>
          <SectionTitle
            subtitle="Şansal Hukuk Bürosu"
            title="Profesyonel Hukuki Destek"
            description="Size en iyi hizmeti sunmak için izlediğimiz süreç."
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {steps.map((step, index) => {
            const Icon = icons[index];
            return (
              <AnimatedSection key={index} delay={index * 0.2}>
                <div className="text-center relative">
                  {/* Step number */}
                  <div className="w-20 h-20 bg-gold/10 rounded-full mx-auto flex items-center justify-center mb-6 relative">
                    <Icon size={32} className="text-gold" />
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-gold text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-primary mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-dark/60 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Connector line (hidden on last item and mobile) */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gold/20" />
                  )}
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
