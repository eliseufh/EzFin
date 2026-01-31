import { getEzFinUser } from "@/lib/auth-helper";
import { getSubscriptionData } from "@/lib/subscription";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import { SettingsForm } from "../_components/settings-form";
import { ManageSubscriptionButton } from "../_components/manage-subscription-button";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getEzFinUser();
  if (!user) redirect("/");

  const subscriptionData = await getSubscriptionData();

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

      {/* --- CARD DE SUBSCRIÇÃO --- */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="dark:text-slate-100">Subscrição</CardTitle>
          <CardDescription className="dark:text-slate-400">
            Gerencie sua subscrição e pagamentos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium dark:text-slate-100">Plano Atual</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={
                    subscriptionData?.subscriptionStatus === "active"
                      ? "default"
                      : "secondary"
                  }
                >
                  {subscriptionData?.plan === "monthly" && "Mensal"}
                  {subscriptionData?.plan === "annual" && "Anual"}
                  {subscriptionData?.plan === "free" && "Gratuito"}
                </Badge>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {subscriptionData?.subscriptionStatus === "active"
                    ? "Ativo"
                    : "Inativo"}
                </span>
              </div>
            </div>
            {subscriptionData?.stripeCustomerId && <ManageSubscriptionButton />}
          </div>

          {subscriptionData?.subscriptionEndsAt && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Expira em:{" "}
              {new Date(subscriptionData.subscriptionEndsAt).toLocaleDateString(
                "pt-BR",
              )}
            </p>
          )}

          {subscriptionData?.subscriptionStatus !== "active" && (
            <Button
              asChild
              className="w-full bg-linear-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              <a href="/pricing">Ver Planos</a>
            </Button>
          )}
        </CardContent>
      </Card>

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
