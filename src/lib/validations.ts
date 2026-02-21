import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Ad soyad en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalı"),
});

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  password: z.string().min(1, "Şifre gereklidir"),
});

export const articleSchema = z.object({
  title: z.string().min(1, "Başlık gereklidir"),
  slug: z.string().min(1, "Slug gereklidir"),
  content: z.string().min(1, "İçerik gereklidir"),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  categoryId: z.string().optional(),
  published: z.boolean(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
});

export const practiceAreaSchema = z.object({
  title: z.string().min(1, "Başlık gereklidir"),
  slug: z.string().min(1, "Slug gereklidir"),
  icon: z.string().optional(),
  shortDesc: z.string().optional(),
  content: z.string().optional(),
  sortOrder: z.number(),
  published: z.boolean(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
});

export const teamMemberSchema = z.object({
  name: z.string().min(1, "İsim gereklidir"),
  title: z.string().min(1, "Ünvan gereklidir"),
  photo: z.string().optional(),
  bio: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  sortOrder: z.number(),
  published: z.boolean(),
});

export const testimonialSchema = z.object({
  name: z.string().min(1, "İsim gereklidir"),
  rating: z.number().min(1).max(5),
  content: z.string().min(1, "Yorum gereklidir"),
  approved: z.boolean(),
});

export const faqSchema = z.object({
  question: z.string().min(1, "Soru gereklidir"),
  answer: z.string().min(1, "Cevap gereklidir"),
  sortOrder: z.number(),
  published: z.boolean(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ArticleFormData = z.infer<typeof articleSchema>;
export type PracticeAreaFormData = z.infer<typeof practiceAreaSchema>;
export type TeamMemberFormData = z.infer<typeof teamMemberSchema>;
export type TestimonialFormData = z.infer<typeof testimonialSchema>;
export type FAQFormData = z.infer<typeof faqSchema>;
