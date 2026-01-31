import { Button } from "@/components/ui/button";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import {
  TrendingUp,
  Target,
  Calendar,
  PieChart,
  Sparkles,
  Shield,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getEzFinUser } from "@/lib/auth-helper";
import { redirect } from "next/navigation";

export default async function Home() {
  // Se o usuário estiver logado, redireciona para o dashboard
  const user = await getEzFinUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="relative min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Círculo grande superior direito */}
        <div
          className="absolute -top-40 -right-40 size-125 bg-green-500/20 rounded-full blur-[100px] animate-pulse"
          style={{ animationDuration: "8s" }}
        />

        {/* Círculo médio inferior esquerdo */}
        <div
          className="absolute -bottom-32 -left-32 size-150 bg-blue-500/20 rounded-full blur-[120px] animate-pulse"
          style={{ animationDuration: "10s", animationDelay: "2s" }}
        />

        {/* Círculo pequeno centro-direita */}
        <div
          className="absolute top-1/3 right-1/4 size-100 bg-purple-500/15 rounded-full blur-[90px] animate-pulse"
          style={{ animationDuration: "12s", animationDelay: "4s" }}
        />

        {/* Grid pattern sutil */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[4rem_4rem]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-linear-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              EzFin
            </span>
          </div>

          <SignedOut>
            <SignInButton mode="modal">
              <Button size="sm" variant="default">
                Entrar
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link href="/dashboard">
              <Button size="sm" variant="outline">
                Dashboard
              </Button>
            </Link>
          </SignedIn>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 rounded-full text-sm font-medium mb-6 border border-green-500/20">
            <Sparkles className="h-4 w-4" />
            Gestão financeira simplificada
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Controle suas finanças
            <br />
            <span className="bg-linear-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              de forma inteligente
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            EzFin é a plataforma completa para gerenciar suas despesas,
            receitas, assinaturas e metas financeiras em um só lugar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="lg" className="text-base px-8">
                  Começar Gratuitamente
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link href="/dashboard">
                <Button size="lg" className="text-base px-8">
                  Ir para o Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-slate-900/50 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-lg text-slate-300">
              Recursos poderosos para simplificar sua vida financeira
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="border-2 border-slate-800 bg-slate-900/50 hover:border-green-500/50 transition-colors backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Transações Inteligentes
                </h3>
                <p className="text-slate-300">
                  Registre receitas e despesas com categorização automática e
                  visualize seus gastos em tempo real.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-2 border-slate-800 bg-slate-900/50 hover:border-blue-500/50 transition-colors backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Gestão de Assinaturas
                </h3>
                <p className="text-slate-300">
                  Acompanhe todas as suas assinaturas e gastos recorrentes com
                  lembretes de vencimento.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-2 border-slate-800 bg-slate-900/50 hover:border-purple-500/50 transition-colors backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Metas Financeiras
                </h3>
                <p className="text-slate-300">
                  Defina objetivos de poupança e acompanhe seu progresso rumo às
                  suas metas financeiras.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="border-2 border-slate-800 bg-slate-900/50 hover:border-orange-500/50 transition-colors backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-4">
                  <PieChart className="h-6 w-6 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Análises Visuais
                </h3>
                <p className="text-slate-300">
                  Gráficos e relatórios detalhados para entender para onde seu
                  dinheiro está indo.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="border-2 border-slate-800 bg-slate-900/50 hover:border-green-500/50 transition-colors backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Rápido e Intuitivo
                </h3>
                <p className="text-slate-300">
                  Interface moderna e responsiva que funciona perfeitamente em
                  todos os dispositivos.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="border-2 border-slate-800 bg-slate-900/50 hover:border-blue-500/50 transition-colors backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Seguro e Privado
                </h3>
                <p className="text-slate-300">
                  Seus dados financeiros são protegidos com autenticação segura
                  e criptografia moderna.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-linear-to-r from-green-600 to-blue-600 rounded-2xl p-12 text-white shadow-2xl shadow-green-500/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pronto para transformar suas finanças?
            </h2>
            <p className="text-xl mb-8 text-green-50">
              Comece gratuitamente e tenha controle total do seu dinheiro hoje
              mesmo.
            </p>

            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-base px-8 bg-white text-green-600 hover:bg-green-50"
                >
                  Criar Conta Grátis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-base px-8 bg-white text-green-600 hover:bg-green-50"
                >
                  Acessar Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 text-white py-8 px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-6 w-6 bg-linear-to-br from-green-600 to-blue-600 rounded flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold">EzFin</span>
          </div>
          <p className="text-slate-400 text-sm">
            © 2026 EzFin. Gestão financeira simplificada para todos.
          </p>
        </div>
      </footer>
    </main>
  );
}
