import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Şansal Hukuk Bürosu | Av. Mehmet Zuhat Şansal",
    template: "%s | Şansal Hukuk Bürosu",
  },
  description:
    "Av. Mehmet Zuhat Şansal - Profesyonel hukuki danışmanlık hizmeti. Aile hukuku, ceza hukuku, miras hukuku ve daha fazlası.",
  keywords: [
    "avukat",
    "hukuk bürosu",
    "Mehmet Zuhat Şansal",
    "Şansal Hukuk",
    "hukuki danışmanlık",
    "İstanbul avukat",
  ],
  authors: [{ name: "Şansal Hukuk Bürosu" }],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Şansal Hukuk Bürosu",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1a3c34",
              color: "#fff",
            },
          }}
        />
      </body>
    </html>
  );
}
