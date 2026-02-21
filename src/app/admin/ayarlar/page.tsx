"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface SettingsGroup {
  title: string;
  fields: {
    key: string;
    label: string;
    type: "text" | "textarea" | "email" | "tel";
    placeholder?: string;
  }[];
}

const settingsGroups: SettingsGroup[] = [
  {
    title: "Genel",
    fields: [
      { key: "site_title", label: "Site Başlığı", type: "text", placeholder: "Şansal Hukuk Bürosu" },
      { key: "site_description", label: "Site Açıklaması", type: "textarea", placeholder: "Site meta açıklaması" },
    ],
  },
  {
    title: "İletişim",
    fields: [
      { key: "phone", label: "Telefon", type: "tel", placeholder: "+90 XXX XXX XX XX" },
      { key: "email", label: "E-posta", type: "email", placeholder: "info@sansalhukuk.com" },
      { key: "address", label: "Adres", type: "textarea", placeholder: "Ofis adresi" },
      { key: "whatsapp", label: "WhatsApp", type: "tel", placeholder: "+90XXXXXXXXXX" },
      { key: "working_hours", label: "Çalışma Saatleri", type: "text", placeholder: "Pzt-Cum: 09:00-18:00" },
      { key: "maps_embed", label: "Google Maps Embed URL", type: "text", placeholder: "https://www.google.com/maps/embed?..." },
    ],
  },
  {
    title: "Sosyal Medya",
    fields: [
      { key: "instagram", label: "Instagram", type: "text", placeholder: "https://instagram.com/..." },
      { key: "linkedin", label: "LinkedIn", type: "text", placeholder: "https://linkedin.com/..." },
      { key: "twitter", label: "Twitter / X", type: "text", placeholder: "https://x.com/..." },
      { key: "facebook", label: "Facebook", type: "text", placeholder: "https://facebook.com/..." },
    ],
  },
  {
    title: "Hero",
    fields: [
      { key: "hero_title", label: "Hero Başlık", type: "text", placeholder: "Tecrübe, Güven, Çözüm" },
      { key: "hero_subtitle", label: "Hero Alt Başlık", type: "text", placeholder: "Av. Mehmet Zuhat Şansal" },
      { key: "hero_description", label: "Hero Açıklama", type: "textarea", placeholder: "Hero bölümü açıklaması" },
    ],
  },
  {
    title: "Hakkımızda",
    fields: [
      { key: "about_text", label: "Hakkımızda Metni", type: "textarea", placeholder: "Hakkımızda bölümü metni" },
    ],
  },
  {
    title: "İstatistikler",
    fields: [
      { key: "stat_1_value", label: "İstatistik 1 - Değer", type: "text", placeholder: "500+" },
      { key: "stat_1_label", label: "İstatistik 1 - Etiket", type: "text", placeholder: "Çözülen Dava" },
      { key: "stat_2_value", label: "İstatistik 2 - Değer", type: "text", placeholder: "4" },
      { key: "stat_2_label", label: "İstatistik 2 - Etiket", type: "text", placeholder: "Alanında Uzman Avukat" },
      { key: "stat_3_value", label: "İstatistik 3 - Değer", type: "text", placeholder: "800+" },
      { key: "stat_3_label", label: "İstatistik 3 - Etiket", type: "text", placeholder: "Mutlu Müvekkil" },
    ],
  },
  {
    title: "Süreç",
    fields: [
      { key: "process_1_title", label: "Süreç 1 - Başlık", type: "text", placeholder: "İlk Görüşme" },
      { key: "process_1_desc", label: "Süreç 1 - Açıklama", type: "textarea", placeholder: "İlk adım açıklaması" },
      { key: "process_2_title", label: "Süreç 2 - Başlık", type: "text", placeholder: "Hukuki Analiz" },
      { key: "process_2_desc", label: "Süreç 2 - Açıklama", type: "textarea", placeholder: "İkinci adım açıklaması" },
      { key: "process_3_title", label: "Süreç 3 - Başlık", type: "text", placeholder: "Dava Takibi" },
      { key: "process_3_desc", label: "Süreç 3 - Açıklama", type: "textarea", placeholder: "Üçüncü adım açıklaması" },
    ],
  },
  {
    title: "Footer",
    fields: [
      { key: "footer_text", label: "Footer Metni", type: "textarea", placeholder: "Footer bölümü metni" },
    ],
  },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setSettings(data);
      } catch {
        toast.error("Ayarlar yüklenirken hata oluştu");
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error();
      toast.success("Ayarlar kaydedildi");
    } catch {
      toast.error("Ayarlar kaydedilirken hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-gold" size={36} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-primary">Ayarlar</h2>
          <p className="text-gray-500 font-body text-sm mt-1">Site ayarlarını düzenleyin</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gold hover:bg-gold/90 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>

      {/* Settings Groups */}
      <div className="space-y-6">
        {settingsGroups.map((group) => (
          <div key={group.title} className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-heading text-lg font-bold text-primary mb-5 pb-3 border-b border-gray-100">
              {group.title}
            </h3>
            <div className="space-y-5">
              {group.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      value={settings[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body text-sm resize-y"
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={settings[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body text-sm"
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gold hover:bg-gold/90 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? "Kaydediliyor..." : "Tüm Ayarları Kaydet"}
        </button>
      </div>
    </div>
  );
}
