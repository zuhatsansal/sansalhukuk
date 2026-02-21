import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Scale,
  Instagram,
  Linkedin,
  Twitter,
  Facebook,
} from "lucide-react";

interface FooterProps {
  settings?: Record<string, string>;
}

const quickLinks = [
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/calisma-alanlari", label: "Çalışma Alanlarımız" },
  { href: "/ekibimiz", label: "Ekibimiz" },
  { href: "/makaleler", label: "Makaleler" },
  { href: "/iletisim", label: "İletişim" },
  { href: "/sss", label: "SSS" },
];

const practiceLinks = [
  { href: "/calisma-alanlari/aile-ve-bosanma-hukuku", label: "Aile Hukuku" },
  { href: "/calisma-alanlari/ceza-ve-agir-ceza-hukuku", label: "Ceza Hukuku" },
  { href: "/calisma-alanlari/miras-hukuku", label: "Miras Hukuku" },
  { href: "/calisma-alanlari/kira-hukuku", label: "Kira Hukuku" },
  { href: "/calisma-alanlari/gayrimenkul-hukuku", label: "Gayrimenkul Hukuku" },
  { href: "/calisma-alanlari/idare-hukuku", label: "İdare Hukuku" },
];

export default function Footer({ settings = {} }: FooterProps) {
  const phone = settings.phone || "+90 XXX XXX XX XX";
  const email = settings.email || "info@sansalhukuk.com";
  const address = settings.address || "İstanbul, Türkiye";
  const footerText =
    settings.footer_text ||
    "Şansal Hukuk Bürosu, müvekkillerine en yüksek kalitede hukuki hizmet sunmayı ilke edinmiştir.";

  const socialLinks = [
    { href: settings.instagram, icon: Instagram, label: "Instagram" },
    { href: settings.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: settings.twitter, icon: Twitter, label: "Twitter" },
    { href: settings.facebook, icon: Facebook, label: "Facebook" },
  ].filter((s) => s.href);

  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="text-gold" size={28} />
              <div>
                <span className="font-heading text-xl font-bold block leading-tight">
                  ŞANSAL
                </span>
                <span className="text-gold text-xs tracking-[3px] uppercase">
                  Hukuk Bürosu
                </span>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              {footerText}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4 text-gold">
              Hızlı Linkler
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Practice Areas */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4 text-gold">
              Çalışma Alanlarımız
            </h3>
            <ul className="space-y-2">
              {practiceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-gold transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-4 text-gold">
              İletişim
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-3 text-white/70 hover:text-gold transition-colors text-sm"
                >
                  <Phone size={16} className="text-gold shrink-0" />
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 text-white/70 hover:text-gold transition-colors text-sm"
                >
                  <Mail size={16} className="text-gold shrink-0" />
                  {email}
                </a>
              </li>
              <li>
                <span className="flex items-start gap-3 text-white/70 text-sm">
                  <MapPin size={16} className="text-gold shrink-0 mt-0.5" />
                  {address}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-white/50">
          <p>&copy; {new Date().getFullYear()} Şansal Hukuk Bürosu. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
