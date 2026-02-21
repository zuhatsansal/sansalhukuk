"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  MessageSquare,
  Mail,
  HelpCircle,
  Image,
  Settings,
  LogOut,
  Scale,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/makaleler", label: "Makaleler", icon: FileText },
  { href: "/admin/calisma-alanlari", label: "Çalışma Alanları", icon: Briefcase },
  { href: "/admin/ekip", label: "Ekip", icon: Users },
  { href: "/admin/yorumlar", label: "Yorumlar", icon: MessageSquare },
  { href: "/admin/iletisim-formu", label: "İletişim Formları", icon: Mail },
  { href: "/admin/sss", label: "SSS", icon: HelpCircle },
  { href: "/admin/medya", label: "Medya", icon: Image },
  { href: "/admin/ayarlar", label: "Ayarlar", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-primary z-50 transition-transform duration-300 flex flex-col",
          "lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3">
            <Scale className="text-gold" size={28} />
            <div>
              <span className="text-white font-heading text-lg font-bold block leading-tight">
                ŞANSAL
              </span>
              <span className="text-gold text-[10px] tracking-[2px] uppercase">
                Admin Panel
              </span>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden text-white">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 text-sm transition-colors",
                  isActive
                    ? "bg-gold/20 text-gold border-r-3 border-gold"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/giris" })}
            className="flex items-center gap-3 px-4 py-2 w-full text-white/70 hover:text-red-400 transition-colors text-sm"
          >
            <LogOut size={18} />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>
    </>
  );
}
