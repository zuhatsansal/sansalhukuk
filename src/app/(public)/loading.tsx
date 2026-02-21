import { Scale } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <Scale className="text-gold mx-auto mb-4 animate-pulse" size={48} />
        <p className="text-gray-dark/50 text-sm">Yükleniyor...</p>
      </div>
    </div>
  );
}
