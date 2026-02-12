"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import type { UserPreferences } from "@/lib/user-preferences";

type UserPreferencesContextValue = {
  preferences: UserPreferences;
  setPreferences: (next: UserPreferences) => void;
};

const UserPreferencesContext =
  React.createContext<UserPreferencesContextValue | null>(null);

export function UserPreferencesProvider({
  initialPreferences,
  children,
}: {
  initialPreferences: UserPreferences;
  children: React.ReactNode;
}) {
  const [preferences, setPreferences] =
    React.useState<UserPreferences>(initialPreferences);
  const { setTheme } = useTheme();

  React.useEffect(() => {
    setTheme(preferences.theme);
  }, [preferences.theme, setTheme]);

  const value = React.useMemo(
    () => ({
      preferences,
      setPreferences,
    }),
    [preferences],
  );

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
}

export function useUserPreferences() {
  const ctx = React.useContext(UserPreferencesContext);
  if (!ctx) {
    throw new Error(
      "useUserPreferences must be used within UserPreferencesProvider",
    );
  }
  return ctx;
}
