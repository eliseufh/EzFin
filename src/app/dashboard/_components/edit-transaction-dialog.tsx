"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateTransaction } from "@/actions/transaction-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "@/i18n/use-translations";

// Definimos o que precisamos receber para editar
interface TransactionData {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: string;
}

export function EditTransactionDialog({
  transaction,
}: {
  transaction: TransactionData;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { t } = useTranslations();

  async function handleSubmit(formData: FormData) {
    setOpen(false);
    toast.success(t("dashboard.editTransactionDialog.updated"));

    updateTransaction(formData)
      .then((result) => {
        if (result?.error) {
          toast.error(result.error);
        }
        startTransition(() => {
          router.refresh();
        });
      })
      .catch(() => {
        toast.error("Erro ao atualizar");
      });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-400 hover:text-blue-600"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {t("dashboard.editTransactionDialog.title")}
          </DialogTitle>
        </DialogHeader>

        {/* Usamos Tabs para manter a lógica de Receita vs Despesa */}
        <Tabs defaultValue={transaction.type} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expense">
              {t("dashboard.addTransactionDialog.expense")}
            </TabsTrigger>
            <TabsTrigger value="income">
              {t("dashboard.addTransactionDialog.income")}
            </TabsTrigger>
          </TabsList>

          {/* O formulário é único, o input hidden define o tipo */}
          <form action={handleSubmit} className="space-y-4 mt-4">
            <input type="hidden" name="id" value={transaction.id} />

            {/* Truque para pegar o valor da tab selecionada */}
            <TabsContent value="expense">
              <input type="hidden" name="type" value="expense" />
            </TabsContent>
            <TabsContent value="income">
              <input type="hidden" name="type" value="income" />
            </TabsContent>

            <div className="grid gap-2">
              <Label>{t("dashboard.form.description")}</Label>
              <Input
                name="description"
                defaultValue={transaction.description}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>{t("dashboard.form.amount")}</Label>
              <Input
                name="amount"
                type="number"
                step="0.01"
                defaultValue={transaction.amount}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>{t("dashboard.form.category")}</Label>
              <Select name="category" defaultValue={transaction.category}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alimentação">
                    {t("dashboard.categories.Alimentação")}
                  </SelectItem>
                  <SelectItem value="Transporte">
                    {t("dashboard.categories.Transporte")}
                  </SelectItem>
                  <SelectItem value="Lazer">
                    {t("dashboard.categories.Lazer")}
                  </SelectItem>
                  <SelectItem value="Saúde">
                    {t("dashboard.categories.Saúde")}
                  </SelectItem>
                  <SelectItem value="Salário">
                    {t("dashboard.categories.Salário")}
                  </SelectItem>
                  <SelectItem value="Outros">
                    {t("dashboard.categories.Outros")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {t("dashboard.editTransactionDialog.saveChanges")}
            </Button>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
