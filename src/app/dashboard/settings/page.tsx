import { getEzFinUser } from "@/lib/auth-helper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import { SettingsForm } from "../_components/settings-form";
import { Settings } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getEzFinUser();
  if (!user) redirect("/");

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto pb-20">
      {/* --- CABEÇALHO --- */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 dark:bg-slate-700 rounded-lg shadow-sm">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Configurações
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Ajuste suas preferências do sistema.
            </p>
          </div>
        </div>
      </div>

      {/* --- CARD DE PREFERÊNCIAS --- */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="dark:text-slate-100">Preferências</CardTitle>
          <CardDescription className="dark:text-slate-400">
            Ajuste a moeda padrão do sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm key={user.currency} initialCurrency={user.currency} />
        </CardContent>
      </Card>
    </div>
  );
}
