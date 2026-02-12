"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

import * as Recharts from "recharts";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { createSubscription } from "@/app/dashboard/subscriptions/actions";
import { createGoal } from "@/app/dashboard/goals/actions";
import { TransactionForm } from "@/app/dashboard/transactions/new/transaction-form";

const CHART_COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#a855f7",
  "#ef4444",
  "#06b6d4",
] as const;

export type DashboardClientProps = {
  currency: string;
  locale: "pt" | "en";
  displayName: string;
  periodLabel: string;
  prevMonthHref: string;
  nextMonthHref: string;
  summary: { balance: number; income: number; expenses: number };
  topCategories: Array<{
    categoryId: string | null;
    categoryName: string;
    total: number;
  }>;
  recent: Array<{
    id: string;
    description: string;
    categoryName: string | null;
    type: "income" | "expense";
    amount: number;
    occurredAt: string;
  }>;
  categories: Array<{
    id: string;
    name: string;
    type: "income" | "expense";
    icon?: string | null;
  }>;
  subscriptions: Array<{
    id: string;
    name: string;
    amount: number;
    billingCycle: "monthly" | "yearly";
    nextDueAt: string;
    isActive: boolean;
  }>;
  goals: Array<{
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    dueAt: string | null;
  }>;
};

function formatMoney(currency: string, value: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(value);
}

function pct(part: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((part / total) * 100);
}

export function DashboardClient(props: DashboardClientProps) {
  const router = useRouter();

  const [txOpen, setTxOpen] = React.useState(false);
  const [txDefaultType, setTxDefaultType] = React.useState<
    "income" | "expense"
  >("expense");

  const [subOpen, setSubOpen] = React.useState(false);
  const [goalOpen, setGoalOpen] = React.useState(false);

  const [subPending, startSub] = React.useTransition();
  const [goalPending, startGoal] = React.useTransition();

  const today = React.useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [subName, setSubName] = React.useState("");
  const [subAmount, setSubAmount] = React.useState("");
  const [subCycle, setSubCycle] = React.useState<"monthly" | "yearly">(
    "monthly",
  );
  const [subNextDue, setSubNextDue] = React.useState(today);

  const [goalName, setGoalName] = React.useState("");
  const [goalTarget, setGoalTarget] = React.useState("");
  const [goalDue, setGoalDue] = React.useState<string>("");

  const totalCategorySpend = props.topCategories.reduce(
    (acc, c) => acc + c.total,
    0,
  );

  const pieData = props.topCategories.map((c, idx) => ({
    name: c.categoryName,
    value: c.total,
    color: CHART_COLORS[idx % CHART_COLORS.length],
  }));

  function openTx(type: "income" | "expense") {
    setTxDefaultType(type);
    setTxOpen(true);
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Visão Geral</h1>
          <p className="text-sm text-muted-foreground">
            Resumo financeiro
            {props.displayName ? ` de ${props.displayName}` : ""}.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="icon"
              aria-label="Mês anterior"
            >
              <Link href={props.prevMonthHref}>
                <ChevronLeft className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" className="gap-2">
              <Calendar className="size-4" />
              <span className="capitalize">{props.periodLabel}</span>
            </Button>
            <Button
              asChild
              variant="outline"
              size="icon"
              aria-label="Próximo mês"
            >
              <Link href={props.nextMonthHref}>
                <ChevronRight className="size-4" />
              </Link>
            </Button>
          </div>

          <Button onClick={() => openTx("expense")} className="gap-2">
            <Plus className="size-4" />
            Nova Transação
          </Button>
        </div>
      </header>

      <Dialog open={txOpen} onOpenChange={setTxOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Nova transação</DialogTitle>
            <DialogDescription>
              Preencha os dados para registrar uma entrada ou saída.
            </DialogDescription>
          </DialogHeader>
          <TransactionForm
            categories={props.categories}
            defaultType={txDefaultType}
            showCard={false}
            onSuccess={() => setTxOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <section className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <Wallet className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-emerald-600">
              {formatMoney(props.currency, props.summary.balance)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              Entradas (Mês)
            </CardTitle>
            <TrendingUp className="size-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {formatMoney(props.currency, props.summary.income)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Saídas (Mês)</CardTitle>
            <TrendingDown className="size-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {formatMoney(props.currency, props.summary.expenses)}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Despesas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Sem gastos neste mês ainda.
              </p>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[1fr_220px] lg:items-center">
                <div className="h-72 w-full">
                  <Recharts.ResponsiveContainer width="100%" height="100%">
                    <Recharts.PieChart>
                      <Recharts.Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={55}
                        outerRadius={95}
                        stroke="hsl(var(--background))"
                        strokeWidth={2}
                      >
                        {pieData.map((entry, index) => (
                          <Recharts.Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                          />
                        ))}
                      </Recharts.Pie>
                      <Recharts.Tooltip
                        formatter={(value: number | string) =>
                          formatMoney(props.currency, Number(value))
                        }
                      />
                    </Recharts.PieChart>
                  </Recharts.ResponsiveContainer>
                </div>

                <div className="space-y-2">
                  {pieData.slice(0, 6).map((c) => (
                    <div
                      key={c.name}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className="inline-block size-2.5 shrink-0 rounded-full"
                          style={{ background: c.color }}
                        />
                        <span className="truncate text-muted-foreground">
                          {c.name}
                        </span>
                      </div>
                      <span className="font-medium">
                        {pct(c.value, totalCategorySpend)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Contas Fixas</CardTitle>
              <Dialog open={subOpen} onOpenChange={setSubOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="size-4" /> Adicionar
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Nova conta fixa</DialogTitle>
                    <DialogDescription>
                      Adicione uma cobrança recorrente.
                    </DialogDescription>
                  </DialogHeader>

                  <form
                    className="grid gap-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      startSub(async () => {
                        await createSubscription({
                          name: subName,
                          amount: subAmount,
                          billingCycle: subCycle,
                          nextDueAt: subNextDue,
                        });
                        setSubName("");
                        setSubAmount("");
                        setSubCycle("monthly");
                        setSubNextDue(today);
                        setSubOpen(false);
                        router.refresh();
                      });
                    }}
                  >
                    <div className="grid gap-2">
                      <Label>Nome</Label>
                      <Input
                        value={subName}
                        onChange={(e) => setSubName(e.target.value)}
                        placeholder="Ex: Netflix"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-2">
                        <Label>Valor</Label>
                        <Input
                          value={subAmount}
                          onChange={(e) => setSubAmount(e.target.value)}
                          inputMode="decimal"
                          placeholder="0,00"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Ciclo</Label>
                        <Select
                          value={subCycle}
                          onValueChange={(v) =>
                            setSubCycle(v === "yearly" ? "yearly" : "monthly")
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Mensal</SelectItem>
                            <SelectItem value="yearly">Anual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Próxima cobrança</Label>
                      <Input
                        type="date"
                        value={subNextDue}
                        onChange={(e) => setSubNextDue(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" disabled={subPending}>
                        {subPending ? "Salvando..." : "Salvar"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-3">
              {props.subscriptions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma conta fixa.
                </p>
              ) : (
                props.subscriptions.slice(0, 3).map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-3 rounded-xl border bg-card/30 p-3"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold">
                        {s.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">
                          {s.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Dia {Number(s.nextDueAt.slice(-2))}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold">
                      {formatMoney(props.currency, s.amount)}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Meus Objetivos</CardTitle>
              <Dialog open={goalOpen} onOpenChange={setGoalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="size-4" /> Nova Meta
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Nova meta</DialogTitle>
                    <DialogDescription>
                      Defina um objetivo e acompanhe o progresso.
                    </DialogDescription>
                  </DialogHeader>

                  <form
                    className="grid gap-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      startGoal(async () => {
                        await createGoal({
                          name: goalName,
                          targetAmount: goalTarget,
                          dueAt: goalDue || null,
                        });
                        setGoalName("");
                        setGoalTarget("");
                        setGoalDue("");
                        setGoalOpen(false);
                        router.refresh();
                      });
                    }}
                  >
                    <div className="grid gap-2">
                      <Label>Nome</Label>
                      <Input
                        value={goalName}
                        onChange={(e) => setGoalName(e.target.value)}
                        placeholder="Ex: Viagem"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="grid gap-2">
                        <Label>Meta</Label>
                        <Input
                          value={goalTarget}
                          onChange={(e) => setGoalTarget(e.target.value)}
                          inputMode="decimal"
                          placeholder="0,00"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Data (opcional)</Label>
                        <Input
                          type="date"
                          value={goalDue}
                          onChange={(e) => setGoalDue(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" disabled={goalPending}>
                        {goalPending ? "Salvando..." : "Salvar"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-4">
              {props.goals.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma meta.</p>
              ) : (
                props.goals.slice(0, 2).map((g) => {
                  const progress = pct(g.currentAmount, g.targetAmount);
                  return (
                    <div key={g.id} className="space-y-2">
                      <div className="text-sm font-medium">{g.name}</div>
                      <Progress value={progress} />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {formatMoney(props.currency, g.currentAmount)}
                        </span>
                        <span>{progress}%</span>
                        <span>
                          {formatMoney(props.currency, g.targetAmount)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Últimas Movimentações</CardTitle>
            <CardDescription>
              <span className="text-xs text-muted-foreground">
                {props.recent.length} item(ns) no período
              </span>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {props.recent.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-sm text-muted-foreground"
                  >
                    Nenhuma movimentação neste mês.
                  </TableCell>
                </TableRow>
              ) : (
                props.recent.slice(0, 10).map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="max-w-65 truncate font-medium">
                      {tx.description}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {tx.categoryName ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {tx.occurredAt}
                    </TableCell>
                    <TableCell
                      className={
                        "text-right font-semibold " +
                        (tx.type === "expense"
                          ? "text-rose-600"
                          : "text-emerald-600")
                      }
                    >
                      {tx.type === "expense" ? "-" : "+"}
                      {formatMoney(props.currency, tx.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          openTx(tx.type === "expense" ? "expense" : "income")
                        }
                      >
                        Duplicar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
