"use client";

import { useTranslations } from "@/i18n/use-translations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SettingsForm } from "./settings-form";
import { ManageSubscriptionButton } from "./manage-subscription-button";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SettingsContentProps {
  initialCurrency: string;
  subscriptionData: {
    plan: string;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    subscriptionStatus: string;
    subscriptionEndsAt: Date | null;
  } | null;
}

export function SettingsContent({
  initialCurrency,
  subscriptionData,
}: SettingsContentProps) {
  const { t } = useTranslations();

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
              {t("dashboard.settingsPage.title")}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t("dashboard.settingsPage.subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* --- CARD DE SUBSCRIÇÃO --- */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="dark:text-slate-100">
            {t("dashboard.settingsPage.subscription")}
          </CardTitle>
          <CardDescription className="dark:text-slate-400">
            {t("dashboard.settingsPage.subscriptionDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium dark:text-slate-100">
                {t("dashboard.settingsPage.currentPlan")}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={
                    subscriptionData?.subscriptionStatus === "active"
                      ? "default"
                      : "secondary"
                  }
                >
                  {subscriptionData?.plan === "monthly" &&
                    t("dashboard.settingsPage.monthly")}
                  {subscriptionData?.plan === "annual" &&
                    t("dashboard.settingsPage.annual")}
                  {subscriptionData?.plan === "free" &&
                    t("dashboard.settingsPage.free")}
                </Badge>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {subscriptionData?.subscriptionStatus === "active"
                    ? t("dashboard.settingsPage.active")
                    : t("dashboard.settingsPage.inactive")}
                </span>
              </div>
            </div>
            {subscriptionData?.stripeCustomerId && <ManageSubscriptionButton />}
          </div>

          {subscriptionData?.subscriptionEndsAt && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t("dashboard.settingsPage.expiresOn")}{" "}
              {new Date(subscriptionData.subscriptionEndsAt).toLocaleDateString(
                "pt-BR",
              )}
            </p>
          )}

          {subscriptionData?.subscriptionStatus !== "active" && (
            <Button
              asChild
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              <a href="/pricing">{t("dashboard.settingsPage.viewPlans")}</a>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* --- CARD DE PREFERÊNCIAS --- */}
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="dark:text-slate-100">
            {t("dashboard.settingsPage.preferences")}
          </CardTitle>
          <CardDescription className="dark:text-slate-400">
            {t("dashboard.settingsPage.preferencesDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm
            key={initialCurrency}
            initialCurrency={initialCurrency}
          />
        </CardContent>
      </Card>
    </div>
  );
}
