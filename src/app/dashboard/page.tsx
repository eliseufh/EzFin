import { db } from "@/lib/db";
import { getEzFinUser } from "@/lib/auth-helper";
import { checkSubscription } from "@/lib/subscription";
import { redirect } from "next/navigation";
import { DashboardContent } from "./_components/dashboard-content";

// Força a renderização dinâmica para garantir que o filtro de meses funcione sempre
export const dynamic = "force-dynamic";

interface DashboardProps {
  searchParams: Promise<{ month?: string; year?: string }>;
}

export default async function DashboardPage(props: DashboardProps) {
  // 1. "Desembrulhar" os searchParams (Necessário no Next.js 15+)
  const searchParams = await props.searchParams;

  // 2. Garantir que o usuário existe e verificar subscrição (OTIMIZADO)
  const user = await getEzFinUser();
  if (!user) {
    redirect("/");
  }

  // 3. Verificar subscrição (usa cache se já foi buscado recentemente)
  const hasActiveSubscription = await checkSubscription();
  if (!hasActiveSubscription) {
    redirect("/pricing");
  }

  // --- LÓGICA DE DATAS DINÂMICA ---
  const now = new Date();
  const currentMonth = searchParams.month
    ? parseInt(searchParams.month)
    : now.getMonth() + 1;
  const currentYear = searchParams.year
    ? parseInt(searchParams.year)
    : now.getFullYear();

  // Intervalo do mês selecionado
  const startDate = new Date(currentYear, currentMonth - 1, 1);
  const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59);

  // 3-8. PARALELIZAR TODAS AS QUERIES (incluindo subscriptions e goals!)
  const [
    transactions,
    globalIncome,
    globalExpense,
    monthlyIncomeAgg,
    monthlyExpenseAgg,
    expensesByCategory,
    subscriptions,
    goals,
  ] = await Promise.all([
    // Transações do mês
    db.transaction.findMany({
      where: {
        userId: user.id,
        date: { gte: startDate, lte: endDate },
      },
      orderBy: { date: "desc" },
      take: 5,
      cacheStrategy: { ttl: 60, swr: 120 },
    }),
    // Saldo global - income
    db.transaction.aggregate({
      where: { userId: user.id, type: "income" },
      _sum: { amount: true },
      cacheStrategy: { ttl: 60, swr: 120 },
    }),
    // Saldo global - expense
    db.transaction.aggregate({
      where: { userId: user.id, type: "expense" },
      _sum: { amount: true },
      cacheStrategy: { ttl: 60, swr: 120 },
    }),
    // Receitas do mês
    db.transaction.aggregate({
      where: {
        userId: user.id,
        type: "income",
        date: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
      cacheStrategy: { ttl: 60, swr: 120 },
    }),
    // Despesas do mês
    db.transaction.aggregate({
      where: {
        userId: user.id,
        type: "expense",
        date: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
      cacheStrategy: { ttl: 60, swr: 120 },
    }),
    // Gastos por categoria
    db.transaction.groupBy({
      by: ["category"],
      where: {
        userId: user.id,
        type: "expense",
        date: { gte: startDate, lte: endDate },
      },
      _sum: { amount: true },
      cacheStrategy: { ttl: 60, swr: 120 },
    }),
    // Assinaturas
    db.subscription.findMany({
      where: { userId: user.id },
      orderBy: { billingDay: "asc" },
      cacheStrategy: { ttl: 120, swr: 240 },
    }),
    // Metas
    db.goal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      cacheStrategy: { ttl: 120, swr: 240 },
    }),
  ]);

  const totalBalance =
    (globalIncome._sum.amount || 0) - (globalExpense._sum.amount || 0);
  const currentMonthIncome = monthlyIncomeAgg._sum.amount || 0;
  const currentMonthExpense = monthlyExpenseAgg._sum.amount || 0;

  const chartData = expensesByCategory.map((item: any) => ({
    name: item.category,
    value: item._sum.amount || 0,
  }));

  return (
    <DashboardContent
      userName={user.name || ""}
      currency={user.currency}
      totalBalance={totalBalance}
      currentMonthIncome={currentMonthIncome}
      currentMonthExpense={currentMonthExpense}
      chartData={chartData}
      transactions={transactions}
      subscriptions={subscriptions}
      goals={goals}
    />
  );
}
