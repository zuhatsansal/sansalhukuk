"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { articleSchema, type ArticleFormData } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { ArrowLeft, Save, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Category {
  id: string;
  name: string;
}

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
  });

  const title = watch("title");

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`/api/articles/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        reset({
          title: data.title,
          slug: data.slug,
          content: data.content,
          excerpt: data.excerpt || "",
          coverImage: data.coverImage || "",
          categoryId: data.categoryId || "",
          published: data.published,
          metaTitle: data.metaTitle || "",
          metaDesc: data.metaDesc || "",
        });
      } catch {
        toast.error("Makale yüklenirken hata oluştu");
        router.push("/admin/makaleler");
      } finally {
        setLoading(false);
      }
    }

    async function fetchCategories() {
      try {
        const res = await fetch("/api/articles?limit=100");
        if (res.ok) {
          const data = await res.json();
          const articles = data.articles || [];
          const categoryMap = new Map<string, Category>();
          for (const article of articles) {
            if (article.category) {
              categoryMap.set(article.category.id, {
                id: article.category.id,
                name: article.category.name,
              });
            }
          }
          setCategories(Array.from(categoryMap.values()));
        }
      } catch {
        // Categories are optional
      }
    }

    fetchArticle();
    fetchCategories();
  }, [id, reset, router]);

  const handleSlugGenerate = () => {
    if (title) {
      setValue("slug", slugify(title));
    }
  };

  const onSubmit = async (data: ArticleFormData) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Hata oluştu");
      }

      toast.success("Makale güncellendi");
      router.push("/admin/makaleler");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Makale güncellenirken hata oluştu");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu makaleyi silmek istediğinize emin misiniz?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Makale silindi");
      router.push("/admin/makaleler");
    } catch {
      toast.error("Makale silinirken hata oluştu");
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
            href="/admin/makaleler"
            className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="font-heading text-2xl font-bold text-primary">Makale Düzenle</h2>
            <p className="text-gray-500 font-body text-sm mt-1">Makaleyi düzenleyin</p>
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Başlık <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("title")}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body text-sm"
                  placeholder="Makale başlığı"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    {...register("slug")}
                    className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body text-sm bg-gray-50"
                    placeholder="makale-basligi"
                  />
                  <button
                    type="button"
                    onClick={handleSlugGenerate}
                    className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Oluştur
                  </button>
                </div>
                {errors.slug && (
                  <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Özet
                </label>
                <textarea
                  {...register("excerpt")}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body text-sm resize-none"
                  placeholder="Kısa makale özeti..."
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  İçerik <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("content")}
                  rows={15}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body text-sm resize-y"
                  placeholder="Makale içeriği..."
                />
                {errors.content && (
                  <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
                )}
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-5">
              <h3 className="font-heading text-lg font-bold text-primary">SEO Ayarları</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Başlık
                </label>
                <input
                  type="text"
                  {...register("metaTitle")}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body text-sm"
                  placeholder="SEO başlığı"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Açıklama
                </label>
                <textarea
                  {...register("metaDesc")}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body text-sm resize-none"
                  placeholder="SEO açıklaması"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish */}
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-5">
              <h3 className="font-heading text-lg font-bold text-primary">Yayın</h3>

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

              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 bg-gold hover:bg-gold/90 text-white py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                {saving ? "Kaydediliyor..." : "Güncelle"}
              </button>
            </div>

            {/* Category */}
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-5">
              <h3 className="font-heading text-lg font-bold text-primary">Kategori</h3>

              <select
                {...register("categoryId")}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body text-sm"
              >
                <option value="">Kategori seçin</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Cover Image */}
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-5">
              <h3 className="font-heading text-lg font-bold text-primary">Kapak Görseli</h3>

              <input
                type="text"
                {...register("coverImage")}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body text-sm"
                placeholder="Görsel URL'si"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
