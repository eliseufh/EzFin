"use client";

import { useState, useEffect } from "react";
import pt from "@/i18n/messages/pt.json";
import en from "@/i18n/messages/en.json";

const messages = { pt, en } as const;

export type Locale = keyof typeof messages;

// Função auxiliar para ler cookies no client-side
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

// Função auxiliar para escrever cookies no client-side
function setCookie(name: string, value: string, days: number = 365) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

export function useTranslations() {
  const [locale, setLocale] = useState<Locale>("pt");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Primeiro verifica cookie (set pelo middleware ou por mudança manual)
    const cookieLang = getCookie("language") as Locale;
    
    // Depois verifica localStorage (para compatibilidade com código antigo)
    const localStorageLang = localStorage.getItem("language") as Locale;
    
    const savedLang = cookieLang || localStorageLang;

    if (savedLang && (savedLang === "pt" || savedLang === "en")) {
      setLocale(savedLang);
      // Sincroniza localStorage com cookie
      if (cookieLang && cookieLang !== localStorageLang) {
        localStorage.setItem("language", cookieLang);
      }
    }
    
    setMounted(true);
  }, []);

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = messages[locale];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  return { t, locale, setLocale, mounted };
}
