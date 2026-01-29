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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";

export function AddTransactionDialog() {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    await createTransaction(formData);
    setOpen(false); // Fecha o modal depois de salvar
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Transação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Movimentação</DialogTitle>
          <DialogDescription>
            Registre manualmente um gasto ou uma entrada extra.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="expense" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expense">Despesa</TabsTrigger>
            <TabsTrigger value="income">Receita</TabsTrigger>
          </TabsList>

          {/* ABA DE DESPESA */}
          <TabsContent value="expense">
            <form action={handleSubmit} className="space-y-4 mt-4">
              <input type="hidden" name="type" value="expense" />
              
              <div className="grid gap-2">
                <Label>Descrição</Label>
                <Input name="description" placeholder="Ex: Mercado, Uber..." required />
              </div>

              <div className="grid gap-2">
                <Label>Valor (€)</Label>
                <Input name="amount" type="number" step="0.01" placeholder="0.00" required />
              </div>

              <div className="grid gap-2">
                <Label>Categoria</Label>
                <Select name="category" defaultValue="Outros">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alimentação">Alimentação</SelectItem>
                    <SelectItem value="Transporte">Transporte</SelectItem>
                    <SelectItem value="Lazer">Lazer</SelectItem>
                    <SelectItem value="Saúde">Saúde</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                Registrar Saída
              </Button>
            </form>
          </TabsContent>

          {/* ABA DE RECEITA */}
          <TabsContent value="income">
            <form action={handleSubmit} className="space-y-4 mt-4">
              <input type="hidden" name="type" value="income" />
              
              <div className="grid gap-2">
                <Label>Descrição</Label>
                <Input name="description" placeholder="Ex: Salário, Freelance..." required />
              </div>

              <div className="grid gap-2">
                <Label>Valor (€)</Label>
                <Input name="amount" type="number" step="0.01" placeholder="0.00" required />
              </div>

              <div className="grid gap-2">
                  <Label>Categoria</Label>
                  <Select name="category" defaultValue="Salário">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Salário">Salário</SelectItem>
                      <SelectItem value="Freelance">Freelance</SelectItem>
                      <SelectItem value="Investimentos">Investimentos</SelectItem>
                      <SelectItem value="Outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Registrar Entrada
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}