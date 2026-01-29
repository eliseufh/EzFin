"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Trash2, Plus } from "lucide-react";
import { updateGoalAmount, deleteGoal } from "@/actions/goal-actions";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GoalCardProps {
  goal: {
    id: string;
    name: string;
    currentAmount: number;
    targetAmount: number;
  };
  currency: string;
}

export function GoalCard({ goal, currency }: GoalCardProps) {
  const [amountToAdd, setAmountToAdd] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const percentage = Math.min(100, Math.floor((goal.currentAmount / goal.targetAmount) * 100));

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amountToAdd);
    if (isNaN(value)) return;

    const newTotal = goal.currentAmount + value;
    try {
      await updateGoalAmount(goal.id, newTotal);
      toast.success(`Adicionado a meta ${goal.name}!`);
      setAmountToAdd("");
      setIsAddOpen(false);
    } catch (error) {
      toast.error("Erro ao atualizar.");
    }
  };

  return (
    <div className="space-y-3 border-b pb-4 last:border-0 last:pb-0">
      <div className="flex justify-between items-center text-sm">
        <span className="font-semibold text-slate-700">{goal.name}</span>
        <div className="flex gap-1">
          
          {/* POPUP PARA ADICIONAR DINHEIRO (Substitui o prompt) */}
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[350px]">
              <DialogHeader>
                <DialogTitle>Adicionar à meta: {goal.name}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSubmit} className="space-y-4 pt-2">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Quanto deseja poupar agora?</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={amountToAdd}
                    onChange={(e) => setAmountToAdd(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  Confirmar Depósito
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* POPUP PARA EXCLUIR META (Substitui o confirm) */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir meta &quot;{goal.name}&quot;?</AlertDialogTitle>
                <AlertDialogDescription>
                  Isso removerá seu objetivo e todo o progresso registrado até agora.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteGoal(goal.id)} className="bg-red-600 hover:bg-red-700">
                  Excluir Meta
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      
      <Progress value={percentage} className="h-2 bg-slate-100" />
      
      <div className="flex justify-between text-[11px] text-slate-500 font-medium">
        <span>{formatCurrency(goal.currentAmount, currency)}</span>
        <span>{percentage}%</span>
        <span>{formatCurrency(goal.targetAmount, currency)}</span>
      </div>
    </div>
  );
}