"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "@/i18n/use-translations";

export function HistoryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslations();

  // Pega o tipo atual da URL ou define 'all' como padrão
  const currentType = searchParams.get("type") || "all";

  function handleFilterChange(value: string) {
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete("type");
    } else {
      params.set("type", value);
    }
    router.push(`/dashboard/history?${params.toString()}`);
  }

  return (
    <Tabs
      defaultValue={currentType}
      onValueChange={handleFilterChange}
      className="w-full sm:w-auto"
    >
      <TabsList className="grid w-full grid-cols-3 sm:w-[300px]">
        <TabsTrigger value="all">
          {t("dashboard.historyFilters.all")}
        </TabsTrigger>
        <TabsTrigger value="income">
          {t("dashboard.historyFilters.income")}
        </TabsTrigger>
        <TabsTrigger value="expense">
          {t("dashboard.historyFilters.expense")}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
