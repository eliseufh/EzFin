"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);

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
        alert("Erro ao acessar portal de pagamentos");
        setLoading(false);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao processar solicitação");
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
      {loading ? "Carregando..." : "Gerenciar Subscrição"}
    </Button>
  );
}
