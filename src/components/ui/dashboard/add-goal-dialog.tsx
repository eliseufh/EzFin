"use client";

import { useState } from "react";
import { createGoal } from "@/actions/goal-actions";
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
import { Plus, Target } from "lucide-react";
import { toast } from "sonner";

export function AddGoalDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Função que lida com o envio do formulário
  async function handleSubmit(formData: FormData) {
    setLoading(true);
    
    try {
      // Chamamos a Action e capturamos o retorno (error ou success)
      const result = await createGoal(formData);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Meta criada! Hora de começar a poupar. 💰");
        setOpen(false); // Fecha o modal apenas em caso de sucesso
      }
    } catch (error) {
      toast.error("Ocorreu um erro inesperado ao salvar a meta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2 border-dashed border-slate-300 hover:border-green-500 hover:text-green-600 transition-all">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline font-medium">Nova Meta</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-full">
              <Target className="h-5 w-5 text-green-600" />
            </div>
            <DialogTitle className="text-xl">Novo Objetivo</DialogTitle>
          </div>
        </DialogHeader>

        {/* IMPORTANTE: O action chama o nosso wrapper handleSubmit 
            para podermos tratar o loading e os toasts de erro.
        */}
        <form action={handleSubmit} className="space-y-5 mt-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-slate-700">O que deseja conquistar?</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex: Reserva de Emergência, Viagem..."
              required
              autoComplete="off"
              className="focus-visible:ring-green-500"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="target" className="text-slate-700">Valor do Objetivo (Meta Final)</Label>
            <Input
              id="target" // Este ID e Name devem ser consistentes
              name="target"
              type="number"
              step="0.01"
              placeholder="0,00"
              required
              className="focus-visible:ring-green-500"
            />
            <p className="text-[10px] text-slate-400">
              Dica: Defina um valor realista para manter a motivação!
            </p>
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
              disabled={loading}
            >
              {loading ? "A processar..." : "Começar a Poupar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}