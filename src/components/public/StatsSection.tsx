"use client";

import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { Gavel, Users, Award } from "lucide-react";
import { parseNumber } from "@/lib/utils";

interface StatsSectionProps {
  stats?: {
    value: string;
    label: string;
  }[];
}

const icons = [Gavel, Users, Award];

export default function StatsSection({
  stats = [
    { value: "500+", label: "Çözülen Dava" },
    { value: "4", label: "Alanında Uzman Avukat" },
    { value: "800+", label: "Mutlu Müvekkil" },
  ],
}: StatsSectionProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section ref={ref} className="py-16 bg-gold">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = icons[index % icons.length];
            const numericValue = parseNumber(stat.value);
            const hasSuffix = stat.value.includes("+");

            return (
              <div
                key={index}
                className="text-center text-white"
              >
                <Icon size={40} className="mx-auto mb-3 opacity-80" />
                <div className="text-4xl md:text-5xl font-heading font-bold mb-2">
                  {inView ? (
                    <CountUp
                      end={numericValue}
                      duration={2.5}
                      separator="."
                      suffix={hasSuffix ? "+" : ""}
                    />
                  ) : (
                    "0"
                  )}
                </div>
                <p className="text-white/80 font-medium text-lg">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
