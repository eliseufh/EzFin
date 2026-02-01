"use client";

import { useState } from "react";
import { updateSettings } from "@/actions/update-settings";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // 1. Importar o router
import { useTranslations } from "@/i18n/use-translations";

interface SettingsFormProps {
  initialCurrency: string;
}

export function SettingsForm({ initialCurrency }: SettingsFormProps) {
  const [currency, setCurrency] = useState(initialCurrency);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // 2. Inicializar o router
  const { t } = useTranslations();

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    // Passamos o formData diretamente
    const result = await updateSettings(formData);

    setLoading(false);

    if (result.error) {
      toast.error(t("dashboard.settingsPage.errorSaving"), {
        description: result.error,
      });
    } else {
      toast.success(t("dashboard.settingsPage.savedSuccess"), {
        description: `${t("dashboard.settingsPage.savedDescription")} ${currency}`,
      });

      // 3. A mágica do Next.js
      // Isso atualiza os dados do servidor (Dashboard) sem recarregar a página
      router.refresh();
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid gap-2">
        <Label htmlFor="currency" className="dark:text-slate-200">
          {t("dashboard.settingsPage.currencyLabel")}
        </Label>
        <select
          name="currency"
          id="currency"
          className="flex h-10 w-full rounded-md border border-input dark:border-slate-700 bg-background dark:bg-slate-900 dark:text-slate-100 px-3 py-2 text-sm"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="EUR">Euro (€)</option>
          <option value="BRL">Real (R$)</option>
          <option value="USD">Dólar ($)</option>
        </select>
      </div>

      <Button type="submit" disabled={loading}>
        {loading
          ? t("dashboard.settingsPage.saving")
          : t("dashboard.settingsPage.saveSettings")}
      </Button>
    </form>
  );
}
