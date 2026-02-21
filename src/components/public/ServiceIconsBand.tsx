import {
  Heart,
  Shield,
  FileText,
  Home,
  Building,
  Landmark,
  Scale,
  Briefcase,
} from "lucide-react";
import Link from "next/link";

const services = [
  { icon: Heart, label: "Aile Hukuku", href: "/calisma-alanlari/aile-ve-bosanma-hukuku" },
  { icon: Shield, label: "Ceza Hukuku", href: "/calisma-alanlari/ceza-ve-agir-ceza-hukuku" },
  { icon: FileText, label: "Miras Hukuku", href: "/calisma-alanlari/miras-hukuku" },
  { icon: Home, label: "Kira Hukuku", href: "/calisma-alanlari/kira-hukuku" },
  { icon: Building, label: "Gayrimenkul", href: "/calisma-alanlari/gayrimenkul-hukuku" },
  { icon: Landmark, label: "İdare Hukuku", href: "/calisma-alanlari/idare-hukuku" },
  { icon: Scale, label: "Hukuki Danışmanlık", href: "/iletisim" },
  { icon: Briefcase, label: "Dava Takibi", href: "/iletisim" },
];

export default function ServiceIconsBand() {
  return (
    <section className="py-10 bg-gold">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {services.map((service) => (
            <Link
              key={service.label}
              href={service.href}
              className="flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors group"
            >
              <service.icon
                size={28}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="text-xs font-medium whitespace-nowrap">
                {service.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
