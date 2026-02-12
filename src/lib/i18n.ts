import type { Locale } from "@/lib/user-preferences";

export type I18nKey =
  | "nav.dashboard"
  | "nav.settings"
  | "dashboard.title"
  | "dashboard.subtitle"
  | "settings.title"
  | "settings.subtitle"
  | "settings.currency"
  | "settings.language"
  | "settings.theme"
  | "settings.save";

const dict: Record<Locale, Record<I18nKey, string>> = {
  pt: {
    "nav.dashboard": "Dashboard",
    "nav.settings": "Settings",
    "dashboard.title": "Dashboard",
    "dashboard.subtitle": "Uma visão rápida do seu mês.",
    "settings.title": "Settings",
    "settings.subtitle": "Preferências salvas no seu perfil.",
    "settings.currency": "Moeda",
    "settings.language": "Idioma",
    "settings.theme": "Tema",
    "settings.save": "Salvar",
  },
  en: {
    "nav.dashboard": "Dashboard",
    "nav.settings": "Settings",
    "dashboard.title": "Dashboard",
    "dashboard.subtitle": "A quick view of your month.",
    "settings.title": "Settings",
    "settings.subtitle": "Preferences saved to your profile.",
    "settings.currency": "Currency",
    "settings.language": "Language",
    "settings.theme": "Theme",
    "settings.save": "Save",
  },
};

export function t(locale: Locale, key: I18nKey) {
  return dict[locale][key];
}
