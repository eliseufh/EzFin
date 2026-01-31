"use client";

import { useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

// Definimos o que precisamos receber para editar
interface TransactionData {
  id: string;
  description: string;
  amount: number;
  category: string;
  type: string;
}

export function EditTransactionDialog({ transaction }: { transaction: TransactionData }) {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    const result = await updateTransaction(formData);
    
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Transação atualizada!");
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Movimentação</DialogTitle>
        </DialogHeader>

        {/* Usamos Tabs para manter a lógica de Receita vs Despesa */}
        <Tabs defaultValue={transaction.type} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="expense">Despesa</TabsTrigger>
            <TabsTrigger value="income">Receita</TabsTrigger>
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
              <Label>Descrição</Label>
              <Input 
                name="description" 
                defaultValue={transaction.description} 
                required 
              />
            </div>

            <div className="grid gap-2">
              <Label>Valor</Label>
              <Input 
                name="amount" 
                type="number" 
                step="0.01" 
                defaultValue={transaction.amount} 
                required 
              />
            </div>

            <div className="grid gap-2">
              <Label>Categoria</Label>
              <Select name="category" defaultValue={transaction.category}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alimentação">Alimentação</SelectItem>
                  <SelectItem value="Transporte">Transporte</SelectItem>
                  <SelectItem value="Lazer">Lazer</SelectItem>
                  <SelectItem value="Saúde">Saúde</SelectItem>
                  <SelectItem value="Salário">Salário</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Salvar Alterações
            </Button>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}