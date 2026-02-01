"use client"; // Precisa ser client side para ter interatividade

import { useState } from "react";
import { createTransaction } from "@/actions/transaction-actions";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { useTranslations } from "@/i18n/use-translations";

export function AddTransactionDialog() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslations();

  async function handleSubmit(formData: FormData) {
    await createTransaction(formData);
    setOpen(false); // Fecha o modal depois de salvar
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          {t("dashboard.addTransactionDialog.newTransaction")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>{t("dashboard.addTransactionDialog.title")}</DialogTitle>
          <DialogDescription>
            {t("dashboard.addTransactionDialog.description")}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="expense" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expense">{t("dashboard.addTransactionDialog.expense")}</TabsTrigger>
            <TabsTrigger value="income">{t("dashboard.addTransactionDialog.income")}</TabsTrigger>
          </TabsList>

          {/* ABA DE DESPESA */}
          <TabsContent value="expense">
            <form action={handleSubmit} className="space-y-4 mt-4">
              <input type="hidden" name="type" value="expense" />

              <div className="grid gap-2">
                <Label>{t("dashboard.form.description")}</Label>
                <Input
                  name="description"
                  placeholder={t("dashboard.addTransactionDialog.descriptionPlaceholder")}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>{t("dashboard.addTransactionDialog.amountLabel")}</Label>
                <Input
                  name="amount"
                  type="number"
                  step="0.01"
                  placeholder={t("dashboard.addTransactionDialog.amountPlaceholder")}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>{t("dashboard.addTransactionDialog.categoryLabel")}</Label>
                <Select name="category" defaultValue="Outros">
                  <SelectTrigger>
                    <SelectValue placeholder={t("dashboard.addTransactionDialog.selectCategory")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alimentação">{t("dashboard.categories.Alimentação")}</SelectItem>
                    <SelectItem value="Transporte">{t("dashboard.categories.Transporte")}</SelectItem>
                    <SelectItem value="Lazer">{t("dashboard.categories.Lazer")}</SelectItem>
                    <SelectItem value="Saúde">{t("dashboard.categories.Saúde")}</SelectItem>
                    <SelectItem value="Outros">{t("dashboard.categories.Outros")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {t("dashboard.addTransactionDialog.registerExpense")}
              </Button>
            </form>
          </TabsContent>

          {/* ABA DE RECEITA */}
          <TabsContent value="income">
            <form action={handleSubmit} className="space-y-4 mt-4">
              <input type="hidden" name="type" value="income" />

              <div className="grid gap-2">
                <Label>{t("dashboard.form.description")}</Label>
                <Input
                  name="description"
                  placeholder={t("dashboard.addTransactionDialog.incomePlaceholder")}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>{t("dashboard.addTransactionDialog.amountLabel")}</Label>
                <Input
                  name="amount"
                  type="number"
                  step="0.01"
                  placeholder={t("dashboard.addTransactionDialog.amountPlaceholder")}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>{t("dashboard.addTransactionDialog.categoryLabel")}</Label>
                <Select name="category" defaultValue="Salário">
                  <SelectTrigger>
                    <SelectValue placeholder={t("dashboard.addTransactionDialog.selectCategory")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Salário">{t("dashboard.categories.Salário")}</SelectItem>
                    <SelectItem value="Freelance">{t("dashboard.categories.Freelance")}</SelectItem>
                    <SelectItem value="Investimentos">{t("dashboard.categories.Investimentos")}</SelectItem>
                    <SelectItem value="Outros">{t("dashboard.categories.Outros")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {t("dashboard.addTransactionDialog.registerIncome")}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
