"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Trash2, Loader2, CheckCircle, XCircle, Star } from "lucide-react";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  content: string;
  approved: boolean;
  createdAt: string;
}

export default function TestimonialsListPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTestimonials(data);
    } catch {
      toast.error("Yorumlar yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleApprove = async (id: string, approved: boolean) => {
    setActionId(id);
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });
      if (!res.ok) throw new Error();
      toast.success(approved ? "Yorum onaylandı" : "Yorum reddedildi");
      setTestimonials((prev) =>
        prev.map((t) => (t.id === id ? { ...t, approved } : t))
      );
    } catch {
      toast.error("İşlem sırasında hata oluştu");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu yorumu silmek istediğinize emin misiniz?")) return;
    setActionId(id);
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Yorum silindi");
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch {
      toast.error("Yorum silinirken hata oluştu");
    } finally {
      setActionId(null);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= rating ? "text-gold fill-gold" : "text-gray-300"}
          />
        ))}
      </div>
    );
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
      <div>
        <h2 className="font-heading text-2xl font-bold text-primary">Yorumlar</h2>
        <p className="text-gray-500 font-body text-sm mt-1">
          Toplam {testimonials.length} yorum -{" "}
          {testimonials.filter((t) => !t.approved).length} bekleyen
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İsim
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Puan
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yorum
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {testimonials.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400 text-sm">
                    Henüz yorum yok
                  </td>
                </tr>
              ) : (
                testimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {testimonial.name}
                    </td>
                    <td className="px-6 py-4">{renderStars(testimonial.rating)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {testimonial.content}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          testimonial.approved
                            ? "bg-green-50 text-green-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {testimonial.approved ? "Onaylı" : "Beklemede"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(testimonial.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {!testimonial.approved ? (
                          <button
                            onClick={() => handleApprove(testimonial.id, true)}
                            disabled={actionId === testimonial.id}
                            className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50"
                            title="Onayla"
                          >
                            <CheckCircle size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApprove(testimonial.id, false)}
                            disabled={actionId === testimonial.id}
                            className="p-2 text-gray-400 hover:text-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors disabled:opacity-50"
                            title="Onayı Kaldır"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                        <Link
                          href={`/admin/yorumlar/${testimonial.id}`}
                          className="p-2 text-gray-400 hover:text-gold rounded-lg hover:bg-gold/5 transition-colors"
                          title="Düzenle"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(testimonial.id)}
                          disabled={actionId === testimonial.id}
                          className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Sil"
                        >
                          <Trash2 size={16} />
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
