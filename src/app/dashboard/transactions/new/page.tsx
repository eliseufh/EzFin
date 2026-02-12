import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import {
  ensureDefaultCategoriesForUser,
  getCategoriesForUser,
} from "@/db/queries/categories";
import { TransactionForm } from "@/app/dashboard/transactions/new/transaction-form";

export default async function NewTransactionPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  await ensureDefaultCategoriesForUser(userId);
  const categories = await getCategoriesForUser(userId);

  return <TransactionForm categories={categories} />;
}
