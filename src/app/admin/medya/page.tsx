"use client";

import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Loader2, Copy, Check, Image as ImageIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string | null;
  size: number | null;
  alt: string | null;
  createdAt: string;
}

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/media");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMedia(data);
    } catch {
      toast.error("Medya yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      toast.success(`${data.length || 1} dosya yüklendi`);
      fetchMedia();
    } catch {
      toast.error("Dosya yüklenirken hata oluştu");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu dosyayı silmek istediğinize emin misiniz?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Dosya silindi");
      setMedia((prev) => prev.filter((m) => m.id !== id));
    } catch {
      toast.error("Dosya silinirken hata oluştu");
    } finally {
      setDeleting(null);
    }
  };

  const handleCopyUrl = async (id: string, url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast.success("URL kopyalandı");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("URL kopyalanamadı");
    }
  };

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
          <h2 className="font-heading text-2xl font-bold text-primary">Medya Kütüphanesi</h2>
          <p className="text-gray-500 font-body text-sm mt-1">
            Toplam {media.length} dosya
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors cursor-pointer ${
              uploading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {uploading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Upload size={18} />
            )}
            {uploading ? "Yükleniyor..." : "Dosya Yükle"}
          </label>
        </div>
      </div>

      {/* Grid */}
      {media.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <ImageIcon className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-400 font-body">Henüz yüklenmiş dosya yok</p>
          <p className="text-gray-300 font-body text-sm mt-1">
            Dosya yüklemek için yukarıdaki butonu kullanın
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden group"
            >
              {/* Image Preview */}
              <div className="aspect-square relative bg-gray-100">
                {item.mimeType?.startsWith("image/") ? (
                  <img
                    src={item.url}
                    alt={item.alt || item.originalName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="text-gray-300" size={32} />
                  </div>
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleCopyUrl(item.id, item.url)}
                    className="p-2 bg-white rounded-lg text-gray-700 hover:text-gold transition-colors"
                    title="URL Kopyala"
                  >
                    {copiedId === item.id ? (
                      <Check size={16} />
                    ) : (
                      <Copy size={16} />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id}
                    className="p-2 bg-white rounded-lg text-gray-700 hover:text-red-500 transition-colors disabled:opacity-50"
                    title="Sil"
                  >
                    {deleting === item.id ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-xs font-medium text-gray-700 truncate" title={item.originalName}>
                  {item.originalName}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-400">{formatFileSize(item.size)}</p>
                  <p className="text-xs text-gray-400">{formatDate(item.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
