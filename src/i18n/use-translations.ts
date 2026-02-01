"use client";

import { useState, useEffect } from "react";
import pt from "@/i18n/messages/pt.json";
import en from "@/i18n/messages/en.json";

const messages = { pt, en } as const;

export type Locale = keyof typeof messages;

export function useTranslations() {
  const [locale, setLocale] = useState<Locale>("pt");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Locale;
    if (savedLang && (savedLang === "pt" || savedLang === "en")) {
      setLocale(savedLang);
    }
  }, []);

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = messages[locale];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  return { t, locale, setLocale };
}
