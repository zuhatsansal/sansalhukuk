"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import AnimatedSection from "./AnimatedSection";
import SectionTitle from "@/components/ui/SectionTitle";
import { Quote, Star } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  content: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4">
        <AnimatedSection>
          <SectionTitle
            subtitle="Şansal Hukuk Bürosu"
            title="Danışan Yorumları"
            description="Müvekkillerimizin memnuniyeti en büyük referansımızdır."
            light
          />
        </AnimatedSection>

        <div className="mt-12">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="pb-14"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 h-full">
                  <Quote size={32} className="text-gold/50 mb-4" />
                  <p className="text-white/80 leading-relaxed mb-6">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                      <span className="text-gold font-bold text-sm">
                        {getInitials(testimonial.name)}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {testimonial.name}
                      </p>
                      <div className="flex gap-0.5 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < testimonial.rating
                                ? "text-gold fill-gold"
                                : "text-white/20"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
