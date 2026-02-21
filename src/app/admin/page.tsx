"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Mail, MessageSquare, Users, ArrowRight, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface DashboardStats {
  articles: number;
  unreadMessages: number;
  testimonials: number;
  teamMembers: number;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  read: boolean;
  createdAt: string;
}

interface Article {
  id: string;
  title: string;
  published: boolean;
  createdAt: string;
  category: { name: string } | null;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentContacts, setRecentContacts] = useState<ContactSubmission[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const [articlesRes, contactRes, testimonialsRes, teamRes] = await Promise.all([
          fetch("/api/articles?limit=5"),
          fetch("/api/contact"),
          fetch("/api/testimonials"),
          fetch("/api/team"),
        ]);

        // Articles count + recent articles
        const articlesData = await articlesRes.json();
        const articles = articlesData.articles || [];
        const articlesCount = articlesData.pagination?.total ?? articles.length;
        setRecentArticles(articles.slice(0, 5));

        // Contact submissions
        const contacts: ContactSubmission[] = contactRes.ok ? await contactRes.json() : [];
        const unreadMessages = contacts.filter((c: ContactSubmission) => !c.read).length;
        setRecentContacts(contacts.slice(0, 5));

        // Testimonials count
        const testimonials = testimonialsRes.ok ? await testimonialsRes.json() : [];
        const testimonialsCount = Array.isArray(testimonials) ? testimonials.length : 0;

        // Team members count
        const teamMembers = teamRes.ok ? await teamRes.json() : [];
        const teamCount = Array.isArray(teamMembers) ? teamMembers.length : 0;

        setStats({
          articles: articlesCount,
          unreadMessages,
          testimonials: testimonialsCount,
          teamMembers: teamCount,
        });
      } catch {
        toast.error("Dashboard verileri yüklenirken hata oluştu");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-gold" size={36} />
      </div>
    );
  }

  const statCards = [
    {
      label: "Toplam Makale",
      value: stats?.articles ?? 0,
      icon: FileText,
      href: "/admin/makaleler",
    },
    {
      label: "Okunmamış Mesaj",
      value: stats?.unreadMessages ?? 0,
      icon: Mail,
      href: "/admin/iletisim-formu",
    },
    {
      label: "Toplam Yorum",
      value: stats?.testimonials ?? 0,
      icon: MessageSquare,
      href: "/admin/yorumlar",
    },
    {
      label: "Ekip Üyesi",
      value: stats?.teamMembers ?? 0,
      icon: Users,
      href: "/admin/ekip",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="font-heading text-2xl font-bold text-primary">Dashboard</h2>
        <p className="text-gray-500 font-body text-sm mt-1">Sitenizin genel durumu</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-primary font-heading">
                  {card.value}
                </p>
                <p className="text-sm text-gray-500 font-body mt-1">{card.label}</p>
              </div>
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <card.icon className="text-gold" size={24} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Contact Submissions */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-primary">
            Son İletişim Formları
          </h3>
          <Link
            href="/admin/iletisim-formu"
            className="text-gold hover:text-gold/80 text-sm font-medium flex items-center gap-1"
          >
            Tümünü Gör <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentContacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-sm">
                    Henüz iletişim formu yok
                  </td>
                </tr>
              ) : (
                recentContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {contact.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{contact.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {contact.subject || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(contact.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          contact.read
                            ? "bg-gray-100 text-gray-600"
                            : "bg-gold/10 text-gold"
                        }`}
                      >
                        {contact.read ? "Okundu" : "Yeni"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Articles */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-primary">Son Makaleler</h3>
          <Link
            href="/admin/makaleler"
            className="text-gold hover:text-gold/80 text-sm font-medium flex items-center gap-1"
          >
            Tümünü Gör <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Başlık
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentArticles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400 text-sm">
                    Henüz makale yok
                  </td>
                </tr>
              ) : (
                recentArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      <Link
                        href={`/admin/makaleler/${article.id}`}
                        className="hover:text-gold"
                      >
                        {article.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {article.category?.name || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          article.published
                            ? "bg-green-50 text-green-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {article.published ? "Yayında" : "Taslak"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(article.createdAt)}
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
