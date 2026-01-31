"use client";

import { useState } from "react";
import { createSubscription } from "@/actions/transaction-actions";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

export function AddSubscriptionDialog() {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    await createSubscription(formData);
    setOpen(false);
  }

  // Gera uma lista de dias de 1 a 31 para o select
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Plus className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Adicionar
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Assinatura</DialogTitle>
          <DialogDescription>
            Adicione gastos recorrentes mensais (Netflix, Renda, Internet).
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4 mt-4">
          
          <div className="grid gap-2">
            <Label>Nome do Serviço</Label>
            <Input name="name" placeholder="Ex: Netflix, Ginásio..." required />
          </div>

          <div className="grid gap-2">
            <Label>Valor Mensal (€)</Label>
            <Input name="amount" type="number" step="0.01" placeholder="0.00" required />
          </div>

          <div className="grid gap-2">
            <Label>Dia do Vencimento/Cobrança</Label>
            <Select name="billingDay" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o dia" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {days.map((day) => (
                  <SelectItem key={day} value={day.toString()}>
                    Dia {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Salvar Assinatura
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}