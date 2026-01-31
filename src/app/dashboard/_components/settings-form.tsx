"use client";

import { useState } from "react";
import { updateSettings } from "@/actions/update-settings";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // 1. Importar o router

interface SettingsFormProps {
  initialCurrency: string;
}

export function SettingsForm({ initialCurrency }: SettingsFormProps) {
  const [currency, setCurrency] = useState(initialCurrency);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // 2. Inicializar o router

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    // Passamos o formData diretamente
    const result = await updateSettings(formData);

    setLoading(false);

    if (result.error) {
      toast.error("Erro ao salvar", {
        description: result.error,
      });
    } else {
      toast.success("Configurações salvas!", {
        description: `Sua moeda agora é ${currency}`,
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
          Moeda Principal
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
        {loading ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </form>
  );
}
