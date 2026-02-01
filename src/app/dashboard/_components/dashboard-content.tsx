"use client";

import { useTranslations } from "@/i18n/use-translations";
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
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { AddTransactionDialog } from "./add-transaction-dialog";
import { AddSubscriptionDialog } from "./add-subscription-dialog";
import { DeleteButton } from "./delete-button";
import { EditTransactionDialog } from "./edit-transaction-dialog";
import { GoalCard } from "./goal-card";
import { AddGoalDialog } from "./add-goal-dialog";
import { MonthSelector } from "./month-selector";
import { CategoryChart } from "./category-chart";

interface DashboardContentProps {
  userName: string;
  currency: string;
  totalBalance: number;
  currentMonthIncome: number;
  currentMonthExpense: number;
  chartData: { name: string; value: number }[];
  transactions: any[];
  subscriptions: any[];
  goals: any[];
}

export function DashboardContent({
  userName,
  currency,
  totalBalance,
  currentMonthIncome,
  currentMonthExpense,
  chartData,
  transactions,
  subscriptions,
  goals,
}: DashboardContentProps) {
  const { t } = useTranslations();

  // Traduzir os nomes das categorias no chartData
  const translatedChartData = chartData.map((item) => ({
    ...item,
    name: t(`dashboard.categories.${item.name}`),
  }));

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto pb-20">
      {/* --- CABEÇALHO --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t("dashboard.overview")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t("dashboard.balance")} {userName}.
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
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-slate-100">
              {t("dashboard.balance")}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${totalBalance >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {formatCurrency(totalBalance, currency)}
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-slate-100">
              {t("dashboard.income")} ({t("dashboard.thisMonth")})
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-slate-50">
              {formatCurrency(currentMonthIncome, currency)}
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-slate-100">
              {t("dashboard.expenses")} ({t("dashboard.thisMonth")})
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-slate-50">
              {formatCurrency(currentMonthExpense, currency)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* --- COLUNA ESQUERDA --- */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-base font-semibold dark:text-slate-100">
                {t("dashboard.categoryChart.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryChart data={translatedChartData} />
            </CardContent>
          </Card>

          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-base font-semibold dark:text-slate-100">
                {t("dashboard.recentTransactions")}
              </CardTitle>
              <Link href="/dashboard/history">
                <Button
                  variant="link"
                  size="sm"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 font-medium h-auto p-0"
                >
                  {t("dashboard.history")}
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto w-full">
                <Table className="min-w-175 w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-37.5">
                        {t("dashboard.form.description")}
                      </TableHead>
                      <TableHead>{t("dashboard.form.category")}</TableHead>
                      <TableHead>{t("dashboard.form.date")}</TableHead>
                      <TableHead className="text-right">
                        {t("dashboard.form.amount")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("dashboard.actions.edit")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-10 text-muted-foreground italic"
                        >
                          {t("dashboard.noData")}
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((transaction: any) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium truncate max-w-37.5">
                            {transaction.description}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-normal">
                              {t(
                                `dashboard.categories.${transaction.category}`,
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-600 dark:text-slate-300">
                            {new Date(transaction.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell
                            className={`text-right font-bold ${transaction.type === "expense" ? "text-red-600" : "text-green-600"}`}
                          >
                            {transaction.type === "expense" ? "-" : "+"}{" "}
                            {formatCurrency(transaction.amount, currency)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <EditTransactionDialog
                                transaction={transaction}
                              />
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
        </div>

        {/* --- COLUNA DIREITA --- */}
        <div className="space-y-6">
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b dark:border-slate-700 mb-4">
              <CardTitle className="text-base font-semibold dark:text-slate-100">
                {t("dashboard.subscriptions")}
              </CardTitle>
              <AddSubscriptionDialog />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscriptions.length === 0 ? (
                  <p className="text-xs text-center text-muted-foreground py-4">
                    {t("dashboard.noData")}
                  </p>
                ) : (
                  subscriptions.map((sub: any) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between pb-2 border-b last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs border border-blue-200 dark:border-blue-500/30">
                          {sub.name.substring(0, 1).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm dark:text-slate-100">
                            {sub.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {t("dashboard.form.date")} {sub.billingDay}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm dark:text-slate-100">
                          {formatCurrency(sub.amount, currency)}
                        </span>
                        <DeleteButton id={sub.id} type="subscription" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold dark:text-slate-100">
                {t("dashboard.goals")}
              </CardTitle>
              <AddGoalDialog />
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              {goals.length === 0 ? (
                <p className="text-xs text-center text-muted-foreground py-4">
                  {t("dashboard.noData")}
                </p>
              ) : (
                goals.map((g: any) => (
                  <GoalCard key={g.id} goal={g} currency={currency} />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
