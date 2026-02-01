import { getEzFinUser } from "@/lib/auth-helper";
import { getSubscriptionData } from "@/lib/subscription";
import { redirect } from "next/navigation";
import { SettingsContent } from "../_components/settings-content";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getEzFinUser();
  if (!user) redirect("/");

  const subscriptionData = await getSubscriptionData();

  return (
    <SettingsContent
      initialCurrency={user.currency}
      subscriptionData={subscriptionData}
    />
  );
}
