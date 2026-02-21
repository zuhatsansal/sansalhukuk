"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { faqSchema, type FAQFormData } from "@/lib/validations";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NewFAQPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FAQFormData>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: "",
      answer: "",
      sortOrder: 0,
      published: true,
    },
  });

  const onSubmit = async (data: FAQFormData) => {
    setSaving(true);
    try {
      const res = await fetch("/api/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Hata oluştu");
      }

      toast.success("Soru oluşturuldu");
      router.push("/admin/sss");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Soru oluşturulurken hata oluştu"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/sss"
          className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="font-heading text-2xl font-bold text-primary">Yeni Soru</h2>
          <p className="text-gray-500 font-body text-sm mt-1">
            Yeni bir sıkça sorulan soru ekleyin
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-5">
          {/* Question */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Soru <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("question")}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body text-sm"
              placeholder="Soru metni"
            />
            {errors.question && (
              <p className="mt-1 text-sm text-red-500">{errors.question.message}</p>
            )}
          </div>

          {/* Answer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cevap <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("answer")}
              rows={8}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body text-sm resize-y"
              placeholder="Cevap metni..."
            />
            {errors.answer && (
              <p className="mt-1 text-sm text-red-500">{errors.answer.message}</p>
            )}
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sıralama
            </label>
            <input
              type="number"
              {...register("sortOrder", { valueAsNumber: true })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body text-sm"
              placeholder="0"
            />
          </div>

          {/* Published */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published"
              {...register("published")}
              className="w-4 h-4 text-gold border-gray-300 rounded focus:ring-gold"
            />
            <label htmlFor="published" className="text-sm text-gray-700">
              Yayınla
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center justify-center gap-2 bg-gold hover:bg-gold/90 text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  );
}
