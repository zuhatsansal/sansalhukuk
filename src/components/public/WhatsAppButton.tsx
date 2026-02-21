"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber?: string;
}

export default function WhatsAppButton({
  phoneNumber = "+90XXXXXXXXXX",
}: WhatsAppButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  const cleanNumber = phoneNumber.replace(/[^0-9+]/g, "");

  return (
    <a
      href={`https://wa.me/${cleanNumber}?text=Merhaba, hukuki danışmanlık almak istiyorum.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 animate-pulse-soft"
      aria-label="WhatsApp ile iletişime geç"
    >
      <MessageCircle size={28} />
    </a>
  );
}
