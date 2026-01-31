"use client";

import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const router = useRouter();

  // Verifica se usuário já tem subscrição ativa
  useEffect(() => {
    async function checkSubscription() {
      try {
        const response = await fetch("/api/check-subscription");
        const data = await response.json();

        if (data.hasActiveSubscription) {
          // Se já tiver subscrição, vai direto para o dashboard
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Erro ao verificar subscrição:", error);
      } finally {
        setCheckingSubscription(false);
      }
    }

    checkSubscription();
  }, [router]);

  const handleSubscribe = async (plan: "monthly" | "annual") => {
    setLoading(plan);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erro ao criar checkout");
        setLoading(null);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao processar pagamento");
      setLoading(null);
    }
  };

  // Mostra loading enquanto verifica subscrição
  if (checkingSubscription) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-linear-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              EzFin
            </span>
          </div>

          {/* Botão do usuário logado */}
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
              },
            }}
          />
        </div>
      </header>

      {/* Pricing Content */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            Escolha o plano ideal para você
          </h1>
          <p className="text-xl text-slate-400">
            Comece a organizar suas finanças hoje mesmo
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Plano Mensal */}
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 hover:border-green-500/50 transition-all">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Mensal</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">€4,99</span>
                <span className="text-slate-400">/mês</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <span className="text-slate-300">Transações ilimitadas</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <span className="text-slate-300">Controle de assinaturas</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <span className="text-slate-300">Metas de economia</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <span className="text-slate-300">Gráficos e relatórios</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <span className="text-slate-300">Suporte prioritário</span>
              </li>
            </ul>

            <Button
              onClick={() => handleSubscribe("monthly")}
              disabled={loading === "monthly"}
              className="w-full bg-linear-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              {loading === "monthly" ? "Processando..." : "Assinar Mensal"}
            </Button>
          </div>

          {/* Plano Anual */}
          <div className="bg-linear-to-br from-green-900/30 to-blue-900/30 backdrop-blur border-2 border-green-500 rounded-2xl p-8 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-green-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
              MELHOR OFERTA
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Anual</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">€49,99</span>
                <span className="text-slate-400">/ano</span>
              </div>
              <p className="text-green-400 text-sm mt-2 font-semibold">
                Economize 17% (€9,89/ano)
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                <span className="text-slate-200">Transações ilimitadas</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                <span className="text-slate-200">Controle de assinaturas</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                <span className="text-slate-200">Metas de economia</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                <span className="text-slate-200">Gráficos e relatórios</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                <span className="text-slate-200">Suporte prioritário</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                <span className="text-slate-200 font-semibold">
                  2 meses grátis
                </span>
              </li>
            </ul>

            <Button
              onClick={() => handleSubscribe("annual")}
              disabled={loading === "annual"}
              className="w-full bg-linear-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            >
              {loading === "annual" ? "Processando..." : "Assinar Anual"}
            </Button>
          </div>
        </div>

        {/* FAQ ou Info adicional */}
        <div className="mt-16 text-center">
          <p className="text-slate-400">
            Pagamento seguro processado por{" "}
            <span className="text-white font-semibold">Stripe</span>
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Cancele a qualquer momento. Sem taxas ocultas.
          </p>
        </div>
      </div>
    </div>
  );
}
