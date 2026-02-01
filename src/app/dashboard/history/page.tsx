import { db } from "@/lib/db";
import { getEzFinUser } from "@/lib/auth-helper";
import { redirect } from "next/navigation";
import { HistoryContent } from "../_components/history-content";

export const dynamic = "force-dynamic";

interface HistoryPageProps {
  searchParams: Promise<{ q?: string; type?: string }>;
}

export default async function HistoryPage(props: HistoryPageProps) {
  // 1. Desembrulhar parâmetros da URL
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";
  const typeFilter = searchParams.type; // 'income' | 'expense' ou undefined

  // 2. Paralelizar queries para melhor performance
  const [user] = await Promise.all([getEzFinUser()]);

  if (!user) redirect("/");

  // 3. Buscar Transações com Filtros dinâmicos
  const transactions = await db.transaction.findMany({
    where: {
      userId: user.id,
      description: {
        contains: query,
        mode: "insensitive",
      },
      // Aplica filtro de tipo apenas se não for "all" (undefined)
      ...(typeFilter &&
        typeFilter !== "all" && {
          type: typeFilter as "income" | "expense",
        }),
    },
    orderBy: { date: "desc" },
  });

  return (
    <HistoryContent
      transactions={transactions}
      currency={user.currency}
      query={query}
      typeFilter={typeFilter}
    />
  );
}
