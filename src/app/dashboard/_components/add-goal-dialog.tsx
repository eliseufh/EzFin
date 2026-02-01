"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
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
import { useTranslations } from "@/i18n/use-translations";

export function AddGoalDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { t } = useTranslations();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setOpen(false);
    toast.success(t("dashboard.addGoalDialog.success"));

    createGoal(formData)
      .then((result) => {
        if (result?.error) {
          toast.error(result.error);
        }
        startTransition(() => {
          router.refresh();
        });
      })
      .catch(() => {
        toast.error(t("dashboard.addGoalDialog.error"));
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-2 border-dashed border-slate-300 hover:border-green-500 hover:text-green-600 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline font-medium">
            {t("dashboard.addGoalDialog.newGoal")}
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-full">
              <Target className="h-5 w-5 text-green-600" />
            </div>
            <DialogTitle className="text-xl">
              {t("dashboard.addGoalDialog.title")}
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* IMPORTANTE: O action chama o nosso wrapper handleSubmit 
            para podermos tratar o loading e os toasts de erro.
        */}
        <form action={handleSubmit} className="space-y-5 mt-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-slate-700">
              {t("dashboard.addGoalDialog.goalNameLabel")}
            </Label>
            <Input
              id="name"
              name="name"
              placeholder={t("dashboard.addGoalDialog.goalNamePlaceholder")}
              required
              autoComplete="off"
              className="focus-visible:ring-green-500"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="target" className="text-slate-700">
              {t("dashboard.addGoalDialog.targetLabel")}
            </Label>
            <Input
              id="target" // Este ID e Name devem ser consistentes
              name="target"
              type="number"
              step="0.01"
              placeholder={t("dashboard.addGoalDialog.targetPlaceholder")}
              required
              className="focus-visible:ring-green-500"
            />
            <p className="text-[10px] text-slate-400">
              {t("dashboard.addGoalDialog.targetTip")}
            </p>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
              disabled={loading}
            >
              {loading
                ? t("dashboard.addGoalDialog.processing")
                : t("dashboard.addGoalDialog.startSaving")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
