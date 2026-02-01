import { getEzFinUser } from "@/lib/auth-helper";
import { getSubscriptionData } from "@/lib/subscription";
import { redirect } from "next/navigation";
import { SettingsContent } from "../_components/settings-content";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  // Paralelizar queries para melhor performance
  const [user, subscriptionData] = await Promise.all([
    getEzFinUser(),
    getSubscriptionData(),
  ]);

  if (!user) redirect("/");

  return (
    <SettingsContent
      initialCurrency={user.currency}
      subscriptionData={subscriptionData}
    />
  );
}
