"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTransaction } from "@/app/dashboard/transactions/new/actions";

export function TransactionForm({
  categories,
  defaultType,
  title,
  onSuccess,
  showCard = true,
}: {
  categories: Array<{
    id: string;
    name: string;
    type: "income" | "expense";
    icon?: string | null;
  }>;
  defaultType?: "income" | "expense";
  title?: string;
  onSuccess?: () => void;
  showCard?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const today = React.useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [type, setType] = React.useState<"income" | "expense">(
    defaultType ?? "expense",
  );
  const [amount, setAmount] = React.useState<string>("");
  const [occurredAt, setOccurredAt] = React.useState<string>(today);
  const [categoryId, setCategoryId] = React.useState<string | undefined>();
  const [description, setDescription] = React.useState<string>("");

  const filteredCategories = React.useMemo(
    () => categories.filter((c) => c.type === type),
    [categories, type],
  );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      await createTransaction({
        type,
        amount,
        occurredAt,
        categoryId: categoryId ?? null,
        description,
      });

      if (onSuccess) {
        onSuccess();
        router.refresh();
        return;
      }

      router.push("/dashboard");
      router.refresh();
    });
  }

  const content = (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div className="grid gap-2">
        <Label>Tipo</Label>
        <Select
          value={type}
          onValueChange={(v) => setType(v === "income" ? "income" : "expense")}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="expense">Saída</SelectItem>
            <SelectItem value="income">Entrada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="amount">Valor</Label>
        <Input
          id="amount"
          inputMode="decimal"
          placeholder="0,00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="date">Data</Label>
        <Input
          id="date"
          type="date"
          value={occurredAt}
          onChange={(e) => setOccurredAt(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label>Categoria</Label>
        <Select
          value={categoryId ?? "__none"}
          onValueChange={(v) => setCategoryId(v === "__none" ? undefined : v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sem categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__none">Sem categoria</SelectItem>
            {filteredCategories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          placeholder="Ex: Supermercado"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );

  if (!showCard) return content;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title ?? "Nova transação"}</CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
