import { db } from "@/lib/db";
import { getEzFinUser } from "@/lib/auth-helper";
import { formatCurrency } from "@/lib/utils";
import { redirect } from "next/navigation";
import Link from "next/link";

// Componentes UI
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, History } from "lucide-react";

// Seus Componentes Customizados
import { HistorySearch } from "@/components/ui/dashboard/history-search";
import { HistoryFilters } from "@/components/ui/dashboard/history-filters";
import { EditTransactionDialog } from "@/components/ui/dashboard/edit-transaction-dialog";
import { DeleteButton } from "@/components/ui/dashboard/delete-button";

export const dynamic = "force-dynamic";

interface HistoryPageProps {
  searchParams: Promise<{ q?: string; type?: string }>;
}

export default async function HistoryPage(props: HistoryPageProps) {
  // 1. Desembrulhar parâmetros da URL
  const searchParams = await props.searchParams;
  const query = searchParams.q || "";
  const typeFilter = searchParams.type; // 'income' | 'expense' ou undefined

  // 2. Validar Usuário
  const user = await getEzFinUser();
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
      ...(typeFilter && typeFilter !== "all" && { 
        type: typeFilter as "income" | "expense" 
      }),
    },
    orderBy: { date: "desc" },
  });

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto pb-20">
      
      {/* --- NAVEGAÇÃO E TÍTULO --- */}
      <div className="flex flex-col gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-500 hover:text-slate-900 w-fit">
            <ChevronLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </Link>
        
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 rounded-lg shadow-sm">
              <History className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Histórico Completo</h1>
              <p className="text-sm text-slate-500">Consulte e gerencie todas as suas movimentações.</p>
            </div>
          </div>

          {/* --- BARRA DE FERRAMENTAS (Filtros + Busca) --- */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white p-4 rounded-xl border shadow-sm">
            <HistoryFilters />
            <HistorySearch />
          </div>
        </div>
      </div>

      {/* --- TABELA DE RESULTADOS --- */}
      <Card className="shadow-sm border-none overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700">Descrição</TableHead>
                  <TableHead className="font-semibold text-slate-700">Categoria</TableHead>
                  <TableHead className="font-semibold text-slate-700">Data</TableHead>
                  <TableHead className="text-right font-semibold text-slate-700">Valor</TableHead>
                  <TableHead className="text-right font-semibold text-slate-700">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-20 text-slate-500 italic">
                      {query || typeFilter 
                        ? "Nenhum resultado para os filtros aplicados." 
                        : "Você ainda não possui transações registradas."}
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((t) => (
                    <TableRow key={t.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium text-slate-900">
                        {t.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal capitalize">
                          {t.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm">
                        {new Date(t.date).toLocaleDateString("pt-PT")}
                      </TableCell>
                      <TableCell className={`text-right font-bold ${
                        t.type === "expense" ? "text-red-600" : "text-green-600"
                      }`}>
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
      
      {/* Rodapé informativo para mobile */}
      <p className="text-[11px] text-slate-400 text-center md:hidden italic">
        Toque em uma transação para ver detalhes ou ações.
      </p>
    </div>
  );
}