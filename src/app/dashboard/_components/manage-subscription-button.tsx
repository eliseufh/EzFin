"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslations } from "@/i18n/use-translations";
import { toast } from "sonner";

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslations();

  const handleManageSubscription = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/create-portal-session", {
        method: "POST",
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(t("dashboard.manageSubscription.errorPortal"));
        setLoading(false);
      }
    } catch (error) {
      console.error("Erro:", error);
      toast.error(t("dashboard.manageSubscription.errorRequest"));
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleManageSubscription}
      disabled={loading}
      variant="outline"
      className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100"
    >
      {loading
        ? t("dashboard.manageSubscription.loading")
        : t("dashboard.manageSubscription.button")}
    </Button>
  );
}
