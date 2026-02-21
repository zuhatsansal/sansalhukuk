"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teamMemberSchema, type TeamMemberFormData } from "@/lib/validations";
import { ArrowLeft, Save, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
  });

  useEffect(() => {
    async function fetchMember() {
      try {
        const res = await fetch(`/api/team/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        reset({
          name: data.name,
          title: data.title,
          photo: data.photo || "",
          bio: data.bio || "",
          email: data.email || "",
          phone: data.phone || "",
          sortOrder: data.sortOrder,
          published: data.published,
        });
      } catch {
        toast.error("Ekip üyesi yüklenirken hata oluştu");
        router.push("/admin/ekip");
      } finally {
        setLoading(false);
      }
    }
    fetchMember();
  }, [id, reset, router]);

  const onSubmit = async (data: TeamMemberFormData) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/team/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Hata oluştu");
      }

      toast.success("Ekip üyesi güncellendi");
      router.push("/admin/ekip");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Ekip üyesi güncellenirken hata oluştu"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Bu ekip üyesini silmek istediğinize emin misiniz?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/team/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Ekip üyesi silindi");
      router.push("/admin/ekip");
    } catch {
      toast.error("Ekip üyesi silinirken hata oluştu");
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
            href="/admin/ekip"
            className="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="font-heading text-2xl font-bold text-primary">
              Ekip Üyesi Düzenle
            </h2>
            <p className="text-gray-500 font-body text-sm mt-1">Ekip üyesini düzenleyin</p>
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
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ad Soyad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body text-sm"
                  placeholder="Ad Soyad"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ünvan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("title")}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body text-sm"
                  placeholder="Avukat, Stajyer Avukat vb."
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Biyografi
                </label>
                <textarea
                  {...register("bio")}
                  rows={8}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body text-sm resize-y"
                  placeholder="Kişi hakkında kısa bilgi..."
                />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body text-sm"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon
                  </label>
                  <input
                    type="text"
                    {...register("phone")}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body text-sm"
                    placeholder="+90 xxx xxx xx xx"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish & Order */}
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

            {/* Photo */}
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-5">
              <h3 className="font-heading text-lg font-bold text-primary">Fotoğraf</h3>

              <input
                type="text"
                {...register("photo")}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-body text-sm"
                placeholder="Fotoğraf URL'si"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
