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

  // 2. Garantir que o usuário existe
  const user = await getEzFinUser();
  if (!user) {
    redirect("/");
  }

  // 3. Verificar se o usuário tem subscrição ativa
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

  // 3. Buscar transações do mês selecionado (limite 5 para o dashboard)
  const transactions = await db.transaction.findMany({
    where: {
      userId: user.id,
      date: { gte: startDate, lte: endDate },
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

  const totalBalance =
    (globalIncome._sum.amount || 0) - (globalExpense._sum.amount || 0);

  // 5. CALCULAR TOTAIS DO MÊS SELECIONADO
  const monthlyIncomeAgg = await db.transaction.aggregate({
    where: {
      userId: user.id,
      type: "income",
      date: { gte: startDate, lte: endDate },
    },
    _sum: { amount: true },
  });

  const monthlyExpenseAgg = await db.transaction.aggregate({
    where: {
      userId: user.id,
      type: "expense",
      date: { gte: startDate, lte: endDate },
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
    orderBy: { billingDay: "asc" },
  });

  const goals = await db.goal.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

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
