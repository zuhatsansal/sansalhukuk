"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { testimonialSchema, type TestimonialFormData } from "@/lib/validations";
import { ArrowLeft, Save, Trash2, Loader2, Star } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hoverRating, setHoverRating] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
  });

  const currentRating = watch("rating") || 5;

  useEffect(() => {
    async function fetchTestimonial() {
      try {
        const res = await fetch(`/api/testimonials/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        reset({
          name: data.name,
          rating: data.rating,
          content: data.content,
          approved: data.approved,
        });
      } catch {
        toast.error("Yorum yüklenirken hata oluştu");
        router.push("/admin/yorumlar");
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonial();
  }, [id, reset, router]);

  const onSubmit = async (data: TestimonialFormData) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Hata oluştu");
      }

      toast.success("Yorum güncellendi");
      router.push("/admin/yorumlar");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Yorum güncellenirken hata oluştu"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu yorumu silmek istediğinize emin misiniz?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Yorum silindi");
      router.push("/admin/yorumlar");
    } catch {
      toast.error("Yorum silinirken hata oluştu");
    } finally {
      setDeleting(false);
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
        <div className="flex items-center gap-4">
          <Link
            href="/admin/yorumlar"
            className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="font-heading text-2xl font-bold text-primary">Yorum Düzenle</h2>
            <p className="text-gray-500 font-body text-sm mt-1">Yorumu düzenleyin</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
        >
          {deleting ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
          Sil
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              İsim <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body text-sm"
              placeholder="Müvekkil adı"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Puan
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setValue("rating", star)}
                  className="p-0.5"
                >
                  <Star
                    size={24}
                    className={
                      star <= (hoverRating || currentRating)
                        ? "text-gold fill-gold"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500">{currentRating}/5</span>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yorum <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("content")}
              rows={6}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body text-sm resize-y"
              placeholder="Yorum metni..."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
            )}
          </div>

          {/* Approved */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="approved"
              {...register("approved")}
              className="w-4 h-4 text-gold border-gray-300 rounded focus:ring-gold"
            />
            <label htmlFor="approved" className="text-sm text-gray-700">
              Onaylı
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 bg-gold hover:bg-gold/90 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? "Kaydediliyor..." : "Güncelle"}
        </button>
      </form>
    </div>
  );
}
