import "server-only";

import { currentUser } from "@clerk/nextjs/server";

export const CURRENCIES = ["EUR", "USD", "BRL"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const LOCALES = ["pt", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const THEME_PREFERENCES = ["light", "dark", "system"] as const;
export type ThemePreference = (typeof THEME_PREFERENCES)[number];

export type UserPreferences = {
  currency: Currency;
  locale: Locale;
  theme: ThemePreference;
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  currency: "EUR",
  locale: "pt",
  theme: "system",
};

const METADATA_KEY = "ezfinPreferences";

export function parsePreferencesFromMetadata(
  metadata: unknown
): UserPreferences {
  if (!metadata || typeof metadata !== "object") return DEFAULT_PREFERENCES;
  const m = metadata as Record<string, unknown>;

  const currency =
    typeof m.currency === "string" &&
    (CURRENCIES as readonly string[]).includes(m.currency)
      ? (m.currency as Currency)
      : DEFAULT_PREFERENCES.currency;

  const locale =
    typeof m.locale === "string" && (LOCALES as readonly string[]).includes(m.locale)
      ? (m.locale as Locale)
      : DEFAULT_PREFERENCES.locale;

  const theme =
    typeof m.theme === "string" &&
    (THEME_PREFERENCES as readonly string[]).includes(m.theme)
      ? (m.theme as ThemePreference)
      : DEFAULT_PREFERENCES.theme;

  return { currency, locale, theme };
}

export function normalizeUserPreferences(
  input: Partial<UserPreferences>
): UserPreferences {
  return parsePreferencesFromMetadata({
    ...DEFAULT_PREFERENCES,
    ...input,
  });
}

export async function getUserPreferences(): Promise<UserPreferences> {
  const user = await currentUser();
  if (!user) return DEFAULT_PREFERENCES;

  // Clerk metadata is `unknown`-ish; validate.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const raw = (user.publicMetadata as any)?.[METADATA_KEY];
  return parsePreferencesFromMetadata(raw);
}

export function preferencesToMetadata(prefs: UserPreferences) {
  return {
    [METADATA_KEY]: normalizeUserPreferences(prefs),
  };
}
