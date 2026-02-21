import { getSettings } from "@/lib/settings";
import { Scale } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "Şansal Hukuk Bürosu hakkında detaylı bilgi. Kurucu avukat Av. Mehmet Zuhat Şansal ve hukuk büromuz hakkında.",
};

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <>
      {/* Hero */}
      <section className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-gold text-sm font-semibold uppercase tracking-[3px]">
            Şansal Hukuk Bürosu
          </span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mt-3">
            Hakkımızda
          </h1>
          <div className="w-16 h-0.5 bg-gold mx-auto mt-4" />
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <div className="bg-gray-light rounded-lg aspect-square flex items-center justify-center">
              <div className="text-center">
                <Scale className="text-gold mx-auto mb-4" size={80} />
                <span className="font-heading text-3xl font-bold text-primary block">ŞANSAL</span>
                <span className="text-gold text-sm tracking-[4px] uppercase">Hukuk Bürosu</span>
              </div>
            </div>

            {/* Text */}
            <div>
              <h2 className="font-heading text-3xl font-bold text-primary mb-6">
                Av. Mehmet Zuhat Şansal
              </h2>
              <div className="w-16 h-0.5 bg-gold mb-6" />
              <div className="prose prose-lg text-gray-dark/70">
                <p>{settings.about_text}</p>
                <h3 className="font-heading text-primary">Misyonumuz</h3>
                <p>
                  Müvekkillerimize en yüksek kalitede hukuki hizmet sunmak,
                  haklarını etkin bir şekilde korumak ve hukuki süreçlerde
                  güvenilir bir danışman olmaktır.
                </p>
                <h3 className="font-heading text-primary">Vizyonumuz</h3>
                <p>
                  Hukuk alanında öncü, güvenilir ve yenilikçi bir hukuk bürosu
                  olarak müvekkillerimizin yanında olmak, adalete ulaşmada
                  köprü görevi üstlenmektir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
