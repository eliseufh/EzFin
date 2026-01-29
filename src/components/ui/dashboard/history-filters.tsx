"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";

export function HistoryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
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
    <Tabs defaultValue={currentType} onValueChange={handleFilterChange} className="w-full sm:w-auto">
      <TabsList className="grid w-full grid-cols-3 sm:w-[300px]">
        <TabsTrigger value="all">Tudo</TabsTrigger>
        <TabsTrigger value="income">Entradas</TabsTrigger>
        <TabsTrigger value="expense">Saídas</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}