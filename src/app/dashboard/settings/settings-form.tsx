"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserPreferences } from "@/components/user-preferences-provider";
import type {
  Currency,
  Locale,
  ThemePreference,
  UserPreferences,
} from "@/lib/user-preferences";
import { updateUserPreferences } from "@/app/dashboard/settings/actions";
import { t } from "@/lib/i18n";

export function SettingsForm() {
  const { preferences, setPreferences } = useUserPreferences();
  const [draft, setDraft] = React.useState<UserPreferences>(preferences);
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    setDraft(preferences);
  }, [preferences]);

  function onSave() {
    startTransition(async () => {
      const next = await updateUserPreferences(draft);
      setPreferences(next);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t(preferences.locale, "settings.title")}</CardTitle>
        <CardDescription>
          {t(preferences.locale, "settings.subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="currency">
            {t(preferences.locale, "settings.currency")}
          </Label>
          <Select
            value={draft.currency}
            onValueChange={(value) =>
              setDraft((d) => ({ ...d, currency: value as Currency }))
            }
          >
            <SelectTrigger id="currency" className="w-full">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="BRL">BRL (R$)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="language">
            {t(preferences.locale, "settings.language")}
          </Label>
          <Select
            value={draft.locale}
            onValueChange={(value) =>
              setDraft((d) => ({ ...d, locale: value as Locale }))
            }
          >
            <SelectTrigger id="language" className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt">Português</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="theme">
            {t(preferences.locale, "settings.theme")}
          </Label>
          <Select
            value={draft.theme}
            onValueChange={(value) =>
              setDraft((d) => ({ ...d, theme: value as ThemePreference }))
            }
          >
            <SelectTrigger id="theme" className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">Sistema</SelectItem>
              <SelectItem value="light">Claro</SelectItem>
              <SelectItem value="dark">Escuro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-end">
          <Button onClick={onSave} disabled={isPending}>
            {isPending ? "..." : t(preferences.locale, "settings.save")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
