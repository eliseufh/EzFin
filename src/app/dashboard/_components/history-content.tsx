"use client";

import Link from "next/link";
import { useTranslations } from "@/i18n/use-translations";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, History } from "lucide-react";
import { HistorySearch } from "./history-search";
import { HistoryFilters } from "./history-filters";
import { EditTransactionDialog } from "./edit-transaction-dialog";
import { DeleteButton } from "./delete-button";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: string;
  date: Date;
}

interface HistoryContentProps {
  transactions: Transaction[];
  currency: string;
  query: string;
  typeFilter?: string;
}

export function HistoryContent({
  transactions,
  currency,
  query,
  typeFilter,
}: HistoryContentProps) {
  const { t } = useTranslations();

  const formatCurrency = (value: number, currencyCode: string) => {
    let locale = "pt-PT";
    if (currencyCode === "BRL") locale = "pt-BR";
    if (currencyCode === "USD") locale = "en-US";

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode,
    }).format(value);
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto pb-20">
      {/* --- NAVEGAÇÃO E TÍTULO --- */}
      <div className="flex flex-col gap-4">
        <Link href="/dashboard">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 w-fit"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("dashboard.historyPage.backToDashboard")}
          </Button>
        </Link>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 dark:bg-slate-700 rounded-lg shadow-sm">
              <History className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {t("dashboard.historyPage.title")}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {t("dashboard.historyPage.subtitle")}
              </p>
            </div>
          </div>

          {/* --- BARRA DE FERRAMENTAS (Filtros + Busca) --- */}
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white dark:bg-slate-800 p-4 rounded-xl border dark:border-slate-700 shadow-sm">
            <HistoryFilters />
            <HistorySearch />
          </div>
        </div>
      </div>

      {/* --- TABELA DE RESULTADOS --- */}
      <Card className="dark:bg-slate-800 dark:border-slate-700 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900">
                <TableRow>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-200">
                    {t("dashboard.historyPage.description")}
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-200">
                    {t("dashboard.historyPage.category")}
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 dark:text-slate-200">
                    {t("dashboard.historyPage.date")}
                  </TableHead>
                  <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-200">
                    {t("dashboard.historyPage.value")}
                  </TableHead>
                  <TableHead className="text-right font-semibold text-slate-700 dark:text-slate-200">
                    {t("dashboard.historyPage.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-20 text-muted-foreground italic"
                    >
                      {query || typeFilter
                        ? t("dashboard.historyPage.noResults")
                        : t("dashboard.historyPage.noTransactions")}
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                        {transaction.description}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="font-normal capitalize"
                        >
                          {t(`dashboard.categories.${transaction.category}`)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500 dark:text-slate-400 text-sm">
                        {new Date(transaction.date).toLocaleDateString("pt-PT")}
                      </TableCell>
                      <TableCell
                        className={`text-right font-bold ${
                          transaction.type === "expense"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {transaction.type === "expense" ? "-" : "+"}{" "}
                        {formatCurrency(transaction.amount, currency)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <EditTransactionDialog transaction={transaction} />
                          <DeleteButton
                            id={transaction.id}
                            type="transaction"
                          />
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
      <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center md:hidden italic">
        {t("dashboard.historyPage.mobileHint")}
      </p>
    </div>
  );
}
