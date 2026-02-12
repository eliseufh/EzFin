import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Lock, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="dark relative min-h-dvh overflow-hidden bg-background text-foreground">
      {/* Unique background: soft grid + two gradient orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(1_0_0/0.08)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.08)_1px,transparent_1px)] bg-size-[64px_64px] opacity-[0.35]" />
        <div className="absolute -left-40 -top-36 size-130 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(20,184,166,0.28),transparent_55%)] blur-2xl" />
        <div className="absolute -right-48 top-5 size-140 rounded-full bg-[radial-gradient(circle_at_40%_40%,rgba(99,102,241,0.26),transparent_55%)] blur-2xl" />
      </div>

      <header className="sticky top-0 z-20 border-b border-border/50 bg-background/40 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="grid size-9 place-items-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25">
              <span className="text-xs font-semibold tracking-widest">EZ</span>
            </div>
            <span className="text-sm font-semibold tracking-tight">EzFin</span>
          </Link>

          <nav className="hidden items-center gap-3 md:flex">
            <Button asChild variant="ghost" size="sm">
              <a href="#how">Como funciona</a>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <a href="#features">Recursos</a>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <a href="#privacy">Privacidade</a>
            </Button>
          </nav>

          <div className="flex items-center gap-2">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Entrar
                </Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button size="sm">
                  Começar
                  <ArrowRight className="size-4" />
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button asChild size="sm">
                <Link href="/dashboard">
                  Abrir dashboard
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </SignedIn>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-14">
        {/* Hero */}
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <Badge
              variant="secondary"
              className="w-fit rounded-full border border-border/50 bg-background/40"
            >
              <Sparkles className="size-3.5" /> simples, rápido, sem ruído
            </Badge>

            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              O seu mapa financeiro —
              <span className="text-primary"> claro</span>,
              <span className="text-primary"> leve</span> e
              <span className="text-primary"> confiável</span>.
            </h1>

            <p className="text-pretty text-base text-muted-foreground sm:text-lg">
              EzFin organiza entradas, saídas, subscrições e metas em um
              dashboard que você entende em segundos.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <SignedIn>
                <Button asChild size="lg">
                  <Link href="/dashboard">
                    Ir para o dashboard
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button size="lg">
                    Criar conta e começar
                    <ArrowRight className="size-4" />
                  </Button>
                </SignInButton>
              </SignedOut>
              <Button asChild size="lg" variant="secondary">
                <a href="#how">Ver como funciona</a>
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full border border-border/50 bg-background/30 px-3 py-1">
                Desktop-first
              </span>
              <span className="rounded-full border border-border/50 bg-background/30 px-3 py-1">
                Ótimo no telemóvel
              </span>
              <span className="rounded-full border border-border/50 bg-background/30 px-3 py-1">
                Dark & light
              </span>
            </div>
          </div>

          {/* Financial map cards */}
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-3xl bg-[radial-gradient(60%_80%_at_50%_20%,hsl(var(--primary)/0.18),transparent_60%)]" />
            <div className="grid gap-4">
              <Card className="border-border/50 bg-background/30 backdrop-blur">
                <div className="p-6">
                  <div className="text-xs text-muted-foreground">Hoje</div>
                  <div className="mt-1 text-2xl font-semibold">
                    Saldo € 1.248,32
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border bg-card/30 p-4">
                      <div className="text-xs text-muted-foreground">
                        Entradas
                      </div>
                      <div className="mt-1 text-sm font-semibold">
                        € 2.430,00
                      </div>
                    </div>
                    <div className="rounded-xl border bg-card/30 p-4">
                      <div className="text-xs text-muted-foreground">
                        Saídas
                      </div>
                      <div className="mt-1 text-sm font-semibold">
                        € 1.181,68
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="border-border/50 bg-background/30 backdrop-blur">
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Lock className="size-4 text-primary" />
                      Dados por usuário
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Cada pessoa vê apenas os próprios registros.
                    </p>
                  </div>
                </Card>
                <Card className="border-border/50 bg-background/30 backdrop-blur">
                  <div className="p-6">
                    <div className="text-sm font-semibold">
                      Sem “planilhas infinitas”
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      O essencial primeiro. O resto entra por feedback.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="mt-16 md:mt-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              Como funciona
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Fluxo simples: registrar → classificar → entender → ajustar.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                n: "01",
                t: "Registre",
                d: "Crie transações (entrada/saída) em segundos.",
              },
              {
                n: "02",
                t: "Organize",
                d: "Categorias e recorrências deixam tudo claro.",
              },
              {
                n: "03",
                t: "Decida",
                d: "Veja o resumo do mês e ajuste o rumo.",
              },
            ].map((s) => (
              <Card
                key={s.n}
                className="border-border/50 bg-background/30 backdrop-blur"
              >
                <div className="p-6">
                  <div className="text-xs text-muted-foreground">{s.n}</div>
                  <div className="mt-2 text-base font-semibold">{s.t}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mt-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              Recursos que importam
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              O EzFin foca em clareza: menos telas, mais entendimento.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Dashboard com modais",
                desc: "Detalhes sem poluir a tela — crie e visualize em popups.",
              },
              {
                title: "Preferências",
                desc: "Moeda, tema e idioma salvos no seu perfil.",
              },
              {
                title: "Subscrições",
                desc: "Acompanhe recorrências e próximas cobranças.",
              },
              {
                title: "Metas",
                desc: "Defina objetivos e acompanhe progresso.",
              },
            ].map((f) => (
              <Card
                key={f.title}
                className="border-border/50 bg-background/30 backdrop-blur"
              >
                <div className="p-6">
                  <div className="text-base font-semibold">{f.title}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Privacy */}
        <section id="privacy" className="mt-16">
          <Card className="border-border/50 bg-background/30 backdrop-blur">
            <div className="grid gap-6 p-8 md:grid-cols-[auto_1fr] md:items-center">
              <div className="grid size-12 place-items-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/25">
                <Lock className="size-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  Privacidade por padrão
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Seus dados ficam isolados por usuário. Você vê o que é seu — e
                  só.
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* CTA */}
        <section className="mt-16">
          <Card className="border-border/50 bg-background/30 backdrop-blur">
            <div className="flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center">
              <div>
                <h3 className="text-balance text-xl font-semibold">
                  Comece hoje e deixe o EzFin organizar o resto.
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Você usa. Você dá feedback. A gente evolui o dashboard.
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button size="lg" className="w-full sm:w-auto">
                      Criar conta
                      <ArrowRight className="size-4" />
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Button asChild size="lg" className="w-full sm:w-auto">
                    <Link href="/dashboard">
                      Abrir dashboard
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </SignedIn>
              </div>
            </div>
          </Card>
        </section>
      </main>

      <footer className="border-t border-border/50">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-8 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} EzFin</span>
          <span>ezfin.site</span>
        </div>
      </footer>
    </div>
  );
}
