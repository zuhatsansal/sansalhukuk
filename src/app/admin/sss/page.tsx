"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface FAQ {
  id: string;
  question: string;
  sortOrder: number;
  published: boolean;
}

export default function FAQListPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchFaqs = async () => {
    try {
      const res = await fetch("/api/faq");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setFaqs(data);
    } catch {
      toast.error("SSS yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu soruyu silmek istediğinize emin misiniz?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/faq/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Soru silindi");
      setFaqs((prev) => prev.filter((f) => f.id !== id));
    } catch {
      toast.error("Soru silinirken hata oluştu");
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
          <h2 className="font-heading text-2xl font-bold text-primary">
            Sıkça Sorulan Sorular
          </h2>
          <p className="text-gray-500 font-body text-sm mt-1">
            Toplam {faqs.length} soru
          </p>
        </div>
        <Link
          href="/admin/sss/yeni"
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
        >
          <Plus size={18} />
          Yeni Soru
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Soru
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
              {faqs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400 text-sm">
                    Henüz soru yok
                  </td>
                </tr>
              ) : (
                faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/sss/${faq.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-gold"
                      >
                        {faq.question}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{faq.sortOrder}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          faq.published
                            ? "bg-green-50 text-green-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {faq.published ? "Yayında" : "Taslak"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/sss/${faq.id}`}
                          className="p-2 text-gray-400 hover:text-gold rounded-lg hover:bg-gold/5 transition-colors"
                          title="Düzenle"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(faq.id)}
                          disabled={deleting === faq.id}
                          className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Sil"
                        >
                          {deleting === faq.id ? (
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
