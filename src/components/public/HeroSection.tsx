"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

export default function HeroSection({
  title = "Tecrübe, Güven, Çözüm",
  subtitle = "Av. Mehmet Zuhat Şansal",
  description = "Hukuki sorunlarınızda yanınızdayız. Profesyonel ve güvenilir hukuki danışmanlık hizmeti için bize ulaşın.",
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-primary overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />

      <div className="relative max-w-7xl mx-auto px-4 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block text-gold font-body text-sm font-semibold uppercase tracking-[4px] mb-4"
            >
              Şansal Hukuk Bürosu
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gold text-xl md:text-2xl font-heading italic mb-6"
            >
              {subtitle}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-white/70 text-lg mb-8 max-w-lg"
            >
              {description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/iletisim"
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold-dark text-white px-8 py-4 rounded-md font-medium text-lg transition-all duration-300 hover:shadow-lg hover:shadow-gold/20"
              >
                İletişime Geç
                <ArrowRight size={20} />
              </Link>
              <a
                href="tel:+90XXXXXXXXXX"
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white hover:border-gold hover:text-gold px-8 py-4 rounded-md font-medium text-lg transition-all duration-300"
              >
                <Phone size={20} />
                Hemen Ara
              </a>
            </motion.div>
          </div>

          {/* Right: Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Decorative frame */}
              <div className="absolute -top-4 -right-4 w-full h-full border-2 border-gold/30 rounded-lg" />
              <div className="relative bg-primary-light/30 rounded-lg aspect-[3/4] flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <div className="w-32 h-32 bg-gold/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-gold text-5xl font-heading font-bold">
                      MZŞ
                    </span>
                  </div>
                  <p className="text-white/50 text-sm">Avukat Fotoğrafı</p>
                  <p className="text-white/30 text-xs mt-1">
                    (Admin panelden değiştirilebilir)
                  </p>
                </div>
              </div>
              {/* Gold accent corner */}
              <div className="absolute -bottom-2 -left-2 w-16 h-16 border-b-4 border-l-4 border-gold rounded-bl-lg" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-gold rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
