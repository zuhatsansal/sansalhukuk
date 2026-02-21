import type { Article, Category, PracticeArea, TeamMember, Testimonial, FAQ, ContactSubmission, SiteSetting, Media } from "@prisma/client";

export type { Article, Category, PracticeArea, TeamMember, Testimonial, FAQ, ContactSubmission, SiteSetting, Media };

export type ArticleWithCategory = Article & {
  category: Category | null;
};

export interface SiteSettings {
  [key: string]: string;
}

export interface DashboardStats {
  totalArticles: number;
  totalPracticeAreas: number;
  totalTeamMembers: number;
  unreadMessages: number;
  totalTestimonials: number;
  totalFaqs: number;
}
