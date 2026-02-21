"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  ChevronDown,
  Scale,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Anasayfa" },
  {
    label: "Kurumsal",
    children: [
      { href: "/hakkimizda", label: "Hakkımızda" },
      { href: "/muvekkil-yorumlari", label: "Müvekkil Yorumları" },
      { href: "/sss", label: "SSS" },
    ],
  },
  { href: "/calisma-alanlari", label: "Çalışma Alanlarımız" },
  { href: "/ekibimiz", label: "Ekibimiz" },
  { href: "/makaleler", label: "Makaleler" },
  { href: "/iletisim", label: "İletişim" },
];

interface HeaderProps {
  phone?: string;
  email?: string;
  address?: string;
}

export default function Header({
  phone = "+90 XXX XXX XX XX",
  email = "info@sansalhukuk.com",
  address = "İstanbul, Türkiye",
}: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary-dark text-white/80 text-sm py-2 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 hover:text-gold transition-colors"
            >
              <Phone size={14} />
              <span>{phone}</span>
            </a>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 hover:text-gold transition-colors"
            >
              <Mail size={14} />
              <span>{email}</span>
            </a>
            <span className="flex items-center gap-2">
              <MapPin size={14} />
              <span>{address}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-primary shadow-lg py-2"
            : "bg-primary/95 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Scale className="text-gold" size={32} />
            <div>
              <span className="text-white font-heading text-xl font-bold block leading-tight">
                ŞANSAL
              </span>
              <span className="text-gold text-xs tracking-[3px] uppercase">
                Hukuk Bürosu
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-4 py-2 text-white/90 hover:text-gold transition-colors text-sm font-medium">
                    {link.label}
                    <ChevronDown size={14} />
                  </button>
                  <AnimatePresence>
                    {openDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 bg-white rounded-md shadow-xl py-2 min-w-[200px]"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block px-4 py-2 text-sm transition-colors ${
                              pathname === child.href
                                ? "text-gold bg-gold/5"
                                : "text-gray-dark hover:text-gold hover:bg-gold/5"
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-gold"
                      : "text-white/90 hover:text-gold"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* CTA Button + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="/iletisim"
              className="hidden md:inline-flex bg-gold hover:bg-gold-dark text-white px-6 py-2.5 rounded-md font-medium text-sm transition-all duration-300"
            >
              İletişime Geç
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white p-2"
              aria-label="Menü"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-80 bg-primary shadow-xl overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-gold font-heading text-xl font-bold">
                    Menü
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-white"
                  >
                    <X size={24} />
                  </button>
                </div>
                <nav className="space-y-1">
                  {navLinks.map((link) =>
                    link.children ? (
                      <div key={link.label}>
                        <button
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === link.label ? null : link.label
                            )
                          }
                          className="w-full flex items-center justify-between px-4 py-3 text-white/90 hover:text-gold transition-colors"
                        >
                          {link.label}
                          <ChevronDown
                            size={16}
                            className={`transition-transform ${
                              openDropdown === link.label ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {openDropdown === link.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              {link.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className="block px-8 py-2 text-sm text-white/70 hover:text-gold transition-colors"
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        key={link.href}
                        href={link.href!}
                        className={`block px-4 py-3 transition-colors ${
                          pathname === link.href
                            ? "text-gold"
                            : "text-white/90 hover:text-gold"
                        }`}
                      >
                        {link.label}
                      </Link>
                    )
                  )}
                </nav>
                <Link
                  href="/iletisim"
                  className="block mt-6 bg-gold text-white text-center px-6 py-3 rounded-md font-medium transition-colors hover:bg-gold-dark"
                >
                  İletişime Geç
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
