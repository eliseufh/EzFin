import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { getEzFinUser } from "@/lib/auth-helper";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";

// Importações dos seus componentes
import { AddTransactionDialog } from "@/components/ui/dashboard/add-transaction-dialog";
import { AddSubscriptionDialog } from "@/components/ui/dashboard/add-subscription-dialog";
import { DeleteButton } from "@/components/ui/dashboard/delete-button";
import { EditTransactionDialog } from "@/components/ui/dashboard/edit-transaction-dialog";
import { GoalCard } from "@/components/ui/dashboard/goal-card";
import { AddGoalDialog } from "@/components/ui/dashboard/add-goal-dialog";
import { MonthSelector } from "@/components/ui/dashboard/month-selector";
import { CategoryChart } from "@/components/ui/dashboard/category-chart";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Força a renderização dinâmica para garantir que o filtro de meses funcione sempre
export const dynamic = "force-dynamic";

interface DashboardProps {
  searchParams: Promise<{ month?: string; year?: string }>;
}

export default async function DashboardPage(props: DashboardProps) {
  // 1. "Desembrulhar" os searchParams (Necessário no Next.js 15+)
  const searchParams = await props.searchParams;

  // 2. Garantir que o usuário existe
  const user = await getEzFinUser();
  if (!user) {
    redirect("/"); 
  }

  // --- LÓGICA DE DATAS DINÂMICA ---
  const now = new Date();
  const currentMonth = searchParams.month ? parseInt(searchParams.month) : now.getMonth() + 1;
  const currentYear = searchParams.year ? parseInt(searchParams.year) : now.getFullYear();

  // Intervalo do mês selecionado
  const startDate = new Date(currentYear, currentMonth - 1, 1);
  const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59);

  // 3. Buscar transações do mês selecionado (limite 5 para o dashboard)
  const transactions = await db.transaction.findMany({
    where: { 
      userId: user.id,
      date: { gte: startDate, lte: endDate } 
    },
    orderBy: { date: "desc" },
    take: 5, 
  });

  // 4. CALCULAR SALDO TOTAL (GLOBAL - Acumulado de sempre)
  const globalIncome = await db.transaction.aggregate({
    where: { userId: user.id, type: "income" },
    _sum: { amount: true },
  });
  
  const globalExpense = await db.transaction.aggregate({
    where: { userId: user.id, type: "expense" },
    _sum: { amount: true },
  });

  const totalBalance = (globalIncome._sum.amount || 0) - (globalExpense._sum.amount || 0);

  // 5. CALCULAR TOTAIS DO MÊS SELECIONADO
  const monthlyIncomeAgg = await db.transaction.aggregate({
    where: { 
      userId: user.id, 
      type: "income",
      date: { gte: startDate, lte: endDate } 
    },
    _sum: { amount: true },
  });

  const monthlyExpenseAgg = await db.transaction.aggregate({
    where: { 
      userId: user.id, 
      type: "expense",
      date: { gte: startDate, lte: endDate }
    },
    _sum: { amount: true },
  });

  const currentMonthIncome = monthlyIncomeAgg._sum.amount || 0;
  const currentMonthExpense = monthlyExpenseAgg._sum.amount || 0;

  // 6. DADOS PARA O GRÁFICO (Gastos por Categoria no mês selecionado)
  const expensesByCategory = await db.transaction.groupBy({
    by: ["category"],
    where: {
      userId: user.id,
      type: "expense",
      date: { gte: startDate, lte: endDate },
    },
    _sum: { amount: true },
  });

  const chartData = expensesByCategory.map((item) => ({
    name: item.category,
    value: item._sum.amount || 0,
  }));

  // 7. Buscar Assinaturas e Metas
  const subscriptions = await db.subscription.findMany({
    where: { userId: user.id },
    orderBy: { billingDay: 'asc' }
  });

  const goals = await db.goal.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto pb-20">
      
      {/* --- CABEÇALHO --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Visão Geral
          </h1>
          <p className="text-sm text-slate-500">
            Resumo financeiro de {user.name}.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <MonthSelector />
          <div className="w-full sm:w-auto">
            <AddTransactionDialog />
          </div>
        </div>
      </div>

      {/* --- CARDS DE RESUMO --- */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card className="shadow-sm border-none bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(totalBalance, user.currency)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entradas (Mês)</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(currentMonthIncome, user.currency)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-none bg-white border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saídas (Mês)</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900">
              {formatCurrency(currentMonthExpense, user.currency)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        
        {/* --- COLUNA ESQUERDA --- */}
        <div className="lg:col-span-2 space-y-6">
          
          <Card className="shadow-sm border-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Despesas por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryChart data={chartData} />
            </CardContent>
          </Card>

          <Card className="shadow-sm border-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Últimas Movimentações</CardTitle>
              <Link href="/dashboard/history">
                <Button variant="link" size="sm" className="text-blue-600 hover:text-blue-700 font-medium h-auto p-0">
                  Ver tudo
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto w-full">
                <Table className="min-w-[700px] w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[150px]">Descrição</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10 text-slate-500 italic">
                          Sem dados para este período.
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="font-medium truncate max-w-[150px]">
                            {t.description}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-normal">{t.category}</Badge>
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {new Date(t.date).toLocaleDateString("pt-PT")}
                          </TableCell>
                          <TableCell className={`text-right font-bold ${t.type === "expense" ? "text-red-600" : "text-green-600"}`}>
                            {t.type === "expense" ? "-" : "+"} {formatCurrency(t.amount, user.currency)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <EditTransactionDialog transaction={t} />
                              <DeleteButton id={t.id} type="transaction" />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- COLUNA DIREITA --- */}
        <div className="space-y-6">
          <Card className="shadow-sm border-none">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b mb-4">
              <CardTitle className="text-base font-semibold">Contas Fixas</CardTitle>
              <AddSubscriptionDialog />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscriptions.length === 0 ? (
                  <p className="text-xs text-center text-slate-400 py-4">Sem contas fixas.</p>
                ) : (
                  subscriptions.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between pb-2 border-b last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-100">
                          {sub.name.substring(0, 1).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{sub.name}</span>
                          <span className="text-[10px] text-slate-500">Dia {sub.billingDay}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm">{formatCurrency(sub.amount, user.currency)}</span>
                        <DeleteButton id={sub.id} type="subscription" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-none border-t-2 border-t-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">Meus Objetivos</CardTitle>
              <AddGoalDialog />
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              {goals.length === 0 ? (
                <p className="text-xs text-center text-slate-400 py-4">Defina uma meta!</p>
              ) : (
                goals.map(g => <GoalCard key={g.id} goal={g} currency={user.currency} />)
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}