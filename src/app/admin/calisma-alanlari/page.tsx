"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface PracticeArea {
  id: string;
  title: string;
  slug: string;
  sortOrder: number;
  published: boolean;
}

export default function PracticeAreasListPage() {
  const [areas, setAreas] = useState<PracticeArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchAreas = async () => {
    try {
      const res = await fetch("/api/practice-areas");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAreas(data);
    } catch {
      toast.error("Çalışma alanları yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu çalışma alanını silmek istediğinize emin misiniz?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/practice-areas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Çalışma alanı silindi");
      setAreas((prev) => prev.filter((a) => a.id !== id));
    } catch {
      toast.error("Çalışma alanı silinirken hata oluştu");
    } finally {
      setDeleting(null);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-primary">Çalışma Alanları</h2>
          <p className="text-gray-500 font-body text-sm mt-1">
            Toplam {areas.length} çalışma alanı
          </p>
        </div>
        <Link
          href="/admin/calisma-alanlari/yeni"
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
        >
          <Plus size={18} />
          Yeni Çalışma Alanı
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Başlık
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sıralama
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {areas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400 text-sm">
                    Henüz çalışma alanı yok
                  </td>
                </tr>
              ) : (
                areas.map((area) => (
                  <tr key={area.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/calisma-alanlari/${area.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-gold"
                      >
                        {area.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{area.sortOrder}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          area.published
                            ? "bg-green-50 text-green-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {area.published ? "Yayında" : "Taslak"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/calisma-alanlari/${area.id}`}
                          className="p-2 text-gray-400 hover:text-gold rounded-lg hover:bg-gold/5 transition-colors"
                          title="Düzenle"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(area.id)}
                          disabled={deleting === area.id}
                          className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Sil"
                        >
                          {deleting === area.id ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
