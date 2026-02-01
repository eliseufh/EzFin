"use client";

import Link from "next/link";
import { LayoutDashboard, Settings } from "lucide-react";
import { useTranslations } from "@/i18n/use-translations";

export function DashboardNav() {
  const { t } = useTranslations();

  return (
    <nav className="flex items-center gap-3 md:gap-6 text-xs md:text-sm font-medium text-slate-600 dark:text-slate-300">
      <Link
        href="/dashboard"
        className="hover:text-green-600 dark:hover:text-green-400 flex items-center gap-1"
      >
        <LayoutDashboard className="h-4 w-4" />
        <span className="hidden sm:inline">{t("dashboard.overview")}</span>
      </Link>
      <Link
        href="/dashboard/settings"
        className="hover:text-green-600 dark:hover:text-green-400 flex items-center gap-1"
      >
        <Settings className="h-4 w-4" />
        <span className="hidden sm:inline">{t("dashboard.settings")}</span>
      </Link>
    </nav>
  );
}
