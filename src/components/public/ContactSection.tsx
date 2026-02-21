"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import AnimatedSection from "./AnimatedSection";
import SectionTitle from "@/components/ui/SectionTitle";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { contactFormSchema, type ContactFormData } from "@/lib/validations";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

interface ContactSectionProps {
  settings?: Record<string, string>;
}

export default function ContactSection({ settings = {} }: ContactSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Gönderim başarısız");

      toast.success("Mesajınız başarıyla gönderildi!");
      reset();
    } catch {
      toast.error("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      label: "Telefon",
      value: settings.phone || "+90 XXX XXX XX XX",
      href: `tel:${settings.phone || "+90XXXXXXXXXX"}`,
    },
    {
      icon: Mail,
      label: "E-posta",
      value: settings.email || "info@sansalhukuk.com",
      href: `mailto:${settings.email || "info@sansalhukuk.com"}`,
    },
    {
      icon: MapPin,
      label: "Adres",
      value: settings.address || "İstanbul, Türkiye",
    },
    {
      icon: Clock,
      label: "Çalışma Saatleri",
      value: settings.working_hours || "Pazartesi - Cuma: 09:00 - 18:00",
    },
  ];

  return (
    <section className="py-20 bg-gray-light">
      <div className="max-w-7xl mx-auto px-4">
        <AnimatedSection>
          <SectionTitle
            subtitle="Şansal Hukuk Bürosu"
            title="İletişime Geçin"
            description="Hukuki sorunlarınız için bizimle iletişime geçin."
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          {/* Form */}
          <AnimatedSection direction="left">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Ad Soyad *"
                    placeholder="Adınız Soyadınız"
                    id="name"
                    {...register("name")}
                    error={errors.name?.message}
                  />
                  <Input
                    label="E-posta *"
                    type="email"
                    placeholder="ornek@email.com"
                    id="email"
                    {...register("email")}
                    error={errors.email?.message}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Telefon"
                    type="tel"
                    placeholder="+90 5XX XXX XX XX"
                    id="phone"
                    {...register("phone")}
                  />
                  <Input
                    label="Konu"
                    placeholder="Mesaj konusu"
                    id="subject"
                    {...register("subject")}
                  />
                </div>
                <Textarea
                  label="Mesajınız *"
                  placeholder="Mesajınızı yazınız..."
                  id="message"
                  rows={5}
                  {...register("message")}
                  error={errors.message?.message}
                />
                <Button
                  type="submit"
                  variant="gold"
                  size="lg"
                  isLoading={isSubmitting}
                  className="w-full"
                >
                  Mesaj Gönder
                </Button>
              </form>
            </div>
          </AnimatedSection>

          {/* Contact Info */}
          <AnimatedSection direction="right">
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-white rounded-lg p-5 shadow-sm"
                >
                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center shrink-0">
                    <info.icon size={22} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-dark/50 mb-1">
                      {info.label}
                    </p>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-primary font-medium hover:text-gold transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-primary font-medium">{info.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
