import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import { UserPreferencesProvider } from "@/components/user-preferences-provider";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { getUserPreferences } from "@/lib/user-preferences";
import { t } from "@/lib/i18n";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const preferences = await getUserPreferences();

  const navItems = [
    { href: "/dashboard", label: t(preferences.locale, "nav.dashboard") },
    {
      href: "/dashboard/settings",
      label: t(preferences.locale, "nav.settings"),
    },
  ];

  return (
    <UserPreferencesProvider initialPreferences={preferences}>
      <div className="min-h-dvh bg-background">
        <DashboardHeader navItems={navItems} />

        <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
      </div>
    </UserPreferencesProvider>
  );
}
