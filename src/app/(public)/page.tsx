import HeroSection from "@/components/public/HeroSection";
import AboutSection from "@/components/public/AboutSection";
import StatsSection from "@/components/public/StatsSection";
import PracticeAreasSection from "@/components/public/PracticeAreasSection";
import TeamSection from "@/components/public/TeamSection";
import ProcessSection from "@/components/public/ProcessSection";
import ServiceIconsBand from "@/components/public/ServiceIconsBand";
import TestimonialsSection from "@/components/public/TestimonialsSection";
import ContactSection from "@/components/public/ContactSection";
import BlogSection from "@/components/public/BlogSection";
import { getSettings } from "@/lib/settings";
import prisma from "@/lib/prisma";

export const revalidate = 3600; // Revalidate every hour

async function getData() {
  try {
    const [settings, practiceAreas, teamMembers, testimonials, articles] =
      await Promise.all([
        getSettings(),
        prisma.practiceArea.findMany({
          where: { published: true },
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            title: true,
            slug: true,
            icon: true,
            shortDesc: true,
          },
        }),
        prisma.teamMember.findMany({
          where: { published: true },
          orderBy: { sortOrder: "asc" },
          select: { id: true, name: true, title: true, photo: true },
        }),
        prisma.testimonial.findMany({
          where: { approved: true },
          orderBy: { createdAt: "desc" },
          select: { id: true, name: true, rating: true, content: true },
        }),
        prisma.article.findMany({
          where: { published: true },
          orderBy: { publishedAt: "desc" },
          take: 3,
          select: {
            id: true,
            title: true,
            slug: true,
            excerpt: true,
            coverImage: true,
            publishedAt: true,
            category: { select: { name: true, slug: true } },
          },
        }),
      ]);

    return { settings, practiceAreas, teamMembers, testimonials, articles };
  } catch {
    // Fallback when DB is not available
    return {
      settings: await getSettings(),
      practiceAreas: [],
      teamMembers: [],
      testimonials: [],
      articles: [],
    };
  }
}

export default async function HomePage() {
  const { settings, practiceAreas, teamMembers, testimonials, articles } =
    await getData();

  const stats = [
    { value: settings.stat_1_value || "500+", label: settings.stat_1_label || "Çözülen Dava" },
    { value: settings.stat_2_value || "4", label: settings.stat_2_label || "Alanında Uzman Avukat" },
    { value: settings.stat_3_value || "800+", label: settings.stat_3_label || "Mutlu Müvekkil" },
  ];

  const processSteps = [
    {
      title: settings.process_1_title || "İlk Görüşme",
      description: settings.process_1_desc || "Hukuki sorununuzu dinliyor, durumu değerlendiriyoruz.",
    },
    {
      title: settings.process_2_title || "Dava Değerlendirme",
      description: settings.process_2_desc || "Davanızı detaylı olarak analiz ediyoruz.",
    },
    {
      title: settings.process_3_title || "Hukuki Strateji",
      description: settings.process_3_desc || "Size özel hukuki strateji hazırlıyoruz.",
    },
  ];

  return (
    <>
      <HeroSection
        title={settings.hero_title}
        subtitle={settings.hero_subtitle}
        description={settings.hero_description}
      />
      <AboutSection text={settings.about_text} />
      <StatsSection stats={stats} />
      {practiceAreas.length > 0 && (
        <PracticeAreasSection areas={practiceAreas} />
      )}
      {teamMembers.length > 0 && <TeamSection members={teamMembers} />}
      <ProcessSection steps={processSteps} />
      <ServiceIconsBand />
      {testimonials.length > 0 && (
        <TestimonialsSection testimonials={testimonials} />
      )}
      <ContactSection settings={settings} />
      {articles.length > 0 && <BlogSection articles={articles} />}
    </>
  );
}
