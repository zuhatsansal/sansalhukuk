import ContactSection from "@/components/public/ContactSection";
import { getSettings } from "@/lib/settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Şansal Hukuk Bürosu ile iletişime geçin. Adres, telefon, e-posta bilgileri ve iletişim formu.",
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <>
      <section className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-gold text-sm font-semibold uppercase tracking-[3px]">Şansal Hukuk Bürosu</span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mt-3">İletişim</h1>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </div>
      </section>

      <ContactSection settings={settings} />

      {/* Google Maps */}
      {settings.maps_embed && (
        <section className="py-0">
          <iframe
            src={settings.maps_embed}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Şansal Hukuk Bürosu Konum"
          />
        </section>
      )}
    </>
  );
}
