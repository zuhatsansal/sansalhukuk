import Link from "next/link";
import { Scale } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="text-center">
        <Scale className="text-gold mx-auto mb-6" size={64} />
        <h1 className="font-heading text-8xl font-bold text-white mb-4">404</h1>
        <h2 className="font-heading text-2xl text-gold mb-4">
          Sayfa Bulunamadı
        </h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <Link
          href="/"
          className="inline-flex bg-gold hover:bg-gold-dark text-white px-8 py-3 rounded-md font-medium transition-colors"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
