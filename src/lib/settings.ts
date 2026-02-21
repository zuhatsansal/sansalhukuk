import prisma from "./prisma";

export async function getSettings(): Promise<Record<string, string>> {
  try {
    const settings = await prisma.siteSetting.findMany();
    const settingsMap: Record<string, string> = {};
    for (const setting of settings) {
      settingsMap[setting.key] = setting.value;
    }
    return settingsMap;
  } catch {
    // Return defaults if DB is not available
    return {
      site_title: "Şansal Hukuk Bürosu",
      phone: "+90 XXX XXX XX XX",
      email: "info@sansalhukuk.com",
      address: "İstanbul, Türkiye",
      whatsapp: "+90XXXXXXXXXX",
      hero_title: "Tecrübe, Güven, Çözüm",
      hero_subtitle: "Av. Mehmet Zuhat Şansal",
      hero_description: "Hukuki sorunlarınızda yanınızdayız.",
      about_text: "Şansal Hukuk Bürosu profesyonel hukuki danışmanlık hizmeti sunmaktadır.",
      stat_1_value: "500+",
      stat_1_label: "Çözülen Dava",
      stat_2_value: "4",
      stat_2_label: "Alanında Uzman Avukat",
      stat_3_value: "800+",
      stat_3_label: "Mutlu Müvekkil",
      footer_text: "Şansal Hukuk Bürosu, müvekkillerine en yüksek kalitede hukuki hizmet sunmayı ilke edinmiştir.",
    };
  }
}

export async function getSetting(key: string): Promise<string | null> {
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key } });
    return setting?.value ?? null;
  } catch {
    return null;
  }
}
