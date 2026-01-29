import { getEzFinUser } from "@/lib/auth-helper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/ui/dashboard/settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getEzFinUser();
  if (!user) redirect("/");

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Configurações</h1>

      <Card>
        <CardHeader>
          <CardTitle>Preferências</CardTitle>
          <CardDescription>
            Ajuste a moeda padrão do sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Removemos a prop initialWhatsapp */}
          <SettingsForm key={user.currency} initialCurrency={user.currency} />
        </CardContent>
      </Card>
    </div>
  );
}