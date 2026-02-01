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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useTranslations } from "@/i18n/use-translations";

export function AddSubscriptionDialog() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslations();

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
            {t("dashboard.addSubscriptionDialog.add")}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {t("dashboard.addSubscriptionDialog.title")}
          </DialogTitle>
          <DialogDescription>
            {t("dashboard.addSubscriptionDialog.description")}
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4 mt-4">
          <div className="grid gap-2">
            <Label>
              {t("dashboard.addSubscriptionDialog.serviceNameLabel")}
            </Label>
            <Input
              name="name"
              placeholder={t(
                "dashboard.addSubscriptionDialog.serviceNamePlaceholder",
              )}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>
              {t("dashboard.addSubscriptionDialog.monthlyAmountLabel")}
            </Label>
            <Input
              name="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>
              {t("dashboard.addSubscriptionDialog.billingDayLabel")}
            </Label>
            <Select name="billingDay" required>
              <SelectTrigger>
                <SelectValue
                  placeholder={t("dashboard.addSubscriptionDialog.selectDay")}
                />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {days.map((day) => (
                  <SelectItem key={day} value={day.toString()}>
                    {t("dashboard.addSubscriptionDialog.day")} {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            {t("dashboard.addSubscriptionDialog.saveSubscription")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
