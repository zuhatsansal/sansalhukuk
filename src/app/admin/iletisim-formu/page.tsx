"use client";

import { useState, useEffect } from "react";
import { Trash2, Loader2, Mail, MailOpen, ChevronDown, ChevronUp } from "lucide-react";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("/api/contact");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSubmissions(data);
    } catch {
      toast.error("İletişim formları yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleMarkRead = async (id: string, read: boolean) => {
    setActionId(id);
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read }),
      });
      if (!res.ok) throw new Error();
      toast.success(read ? "Okundu olarak işaretlendi" : "Okunmadı olarak işaretlendi");
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, read } : s))
      );
    } catch {
      toast.error("İşlem sırasında hata oluştu");
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) return;
    setActionId(id);
    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Mesaj silindi");
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      if (expandedId === id) setExpandedId(null);
    } catch {
      toast.error("Mesaj silinirken hata oluştu");
    } finally {
      setActionId(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    // Auto mark as read when expanding
    const submission = submissions.find((s) => s.id === id);
    if (submission && !submission.read) {
      handleMarkRead(id, true);
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
      <div>
        <h2 className="font-heading text-2xl font-bold text-primary">İletişim Formları</h2>
        <p className="text-gray-500 font-body text-sm mt-1">
          Toplam {submissions.length} mesaj -{" "}
          {submissions.filter((s) => !s.read).length} okunmamış
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-10 px-4 py-3"></th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İsim
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  E-posta
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Konu
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
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
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-400 text-sm">
                    Henüz iletişim formu yok
                  </td>
                </tr>
              ) : (
                submissions.map((submission) => (
                  <>
                    <tr
                      key={submission.id}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        !submission.read ? "bg-gold/5" : ""
                      }`}
                      onClick={() => toggleExpand(submission.id)}
                    >
                      <td className="px-4 py-4">
                        {expandedId === submission.id ? (
                          <ChevronUp size={16} className="text-gray-400" />
                        ) : (
                          <ChevronDown size={16} className="text-gray-400" />
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm ${
                            !submission.read ? "font-bold text-gray-900" : "text-gray-700"
                          }`}
                        >
                          {submission.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {submission.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {submission.subject || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(submission.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            submission.read
                              ? "bg-gray-100 text-gray-600"
                              : "bg-gold/10 text-gold"
                          }`}
                        >
                          {submission.read ? "Okundu" : "Yeni"}
                        </span>
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() =>
                              handleMarkRead(submission.id, !submission.read)
                            }
                            disabled={actionId === submission.id}
                            className="p-2 text-gray-400 hover:text-gold rounded-lg hover:bg-gold/5 transition-colors disabled:opacity-50"
                            title={submission.read ? "Okunmadı işaretle" : "Okundu işaretle"}
                          >
                            {submission.read ? (
                              <Mail size={16} />
                            ) : (
                              <MailOpen size={16} />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(submission.id)}
                            disabled={actionId === submission.id}
                            className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                            title="Sil"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === submission.id && (
                      <tr key={`${submission.id}-detail`}>
                        <td colSpan={7} className="px-6 py-4 bg-gray-50">
                          <div className="space-y-3">
                            {submission.phone && (
                              <div>
                                <span className="text-xs font-medium text-gray-500 uppercase">
                                  Telefon:
                                </span>
                                <p className="text-sm text-gray-700 mt-0.5">
                                  {submission.phone}
                                </p>
                              </div>
                            )}
                            <div>
                              <span className="text-xs font-medium text-gray-500 uppercase">
                                Mesaj:
                              </span>
                              <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-wrap">
                                {submission.message}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
