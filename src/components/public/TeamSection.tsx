"use client";

import Link from "next/link";
import AnimatedSection from "./AnimatedSection";
import SectionTitle from "@/components/ui/SectionTitle";
import { getInitials } from "@/lib/utils";

interface TeamMember {
  id: string;
  name: string;
  title: string;
  photo: string | null;
}

interface TeamSectionProps {
  members: TeamMember[];
}

export default function TeamSection({ members }: TeamSectionProps) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <AnimatedSection>
          <SectionTitle
            subtitle="Şansal Hukuk Bürosu"
            title="Ekibimiz"
            description="Alanında uzman avukat kadromuzla hizmetinizdeyiz."
          />
        </AnimatedSection>

        <div className="flex flex-wrap justify-center gap-8 mt-12">
          {members.map((member, index) => (
            <AnimatedSection key={member.id} delay={index * 0.15}>
              <div className="bg-gray-light rounded-lg overflow-hidden w-72 group hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                {/* Photo */}
                <div className="aspect-[3/4] bg-primary/5 flex items-center justify-center relative overflow-hidden">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gold/20 rounded-full mx-auto flex items-center justify-center">
                        <span className="text-gold text-3xl font-heading font-bold">
                          {getInitials(member.name)}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
                </div>
                {/* Info */}
                <div className="p-6 text-center">
                  <h3 className="font-heading text-lg font-bold text-primary">
                    {member.name}
                  </h3>
                  <p className="text-gold text-sm mt-1">{member.title}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/ekibimiz"
            className="inline-flex items-center gap-2 text-gold hover:text-gold-dark font-medium transition-colors"
          >
            Tüm Ekibimizi Görün →
          </Link>
        </div>
      </div>
    </section>
  );
}
