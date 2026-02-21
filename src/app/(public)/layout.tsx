import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import ScrollToTop from "@/components/public/ScrollToTop";
import { getSettings } from "@/lib/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <>
      <Header
        phone={settings.phone}
        email={settings.email}
        address={settings.address}
      />
      <main>{children}</main>
      <Footer settings={settings} />
      <WhatsAppButton phoneNumber={settings.whatsapp} />
      <ScrollToTop />
    </>
  );
}
