import { getUserPreferences } from "@/lib/user-preferences";
import { auth, currentUser } from "@clerk/nextjs/server";
import {
  getMonthSummary,
  getRecentTransactions,
  getTopCategories,
} from "@/db/queries/dashboard";
import {
  ensureDefaultCategoriesForUser,
  getCategoriesForUser,
} from "@/db/queries/categories";
import { getSubscriptionsForUser } from "@/db/queries/subscriptions";
import { getGoalsForUser } from "@/db/queries/goals";
import { DashboardClient } from "@/app/dashboard/dashboard-client";

function toIsoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}

function parseMonth(value: unknown) {
  if (typeof value !== "string") return null;
  const m = value.match(/^([0-9]{4})-([0-9]{2})$/);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  if (!Number.isFinite(year) || !Number.isFinite(month)) return null;
  if (month < 1 || month > 12) return null;
  return { year, month };
}

function monthKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function addMonths(d: Date, delta: number) {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const preferences = await getUserPreferences();

  const { userId } = await auth();
  if (!userId) {
    // Dashboard layout already protects, but keep this safe for direct rendering.
    return null;
  }

  await ensureDefaultCategoriesForUser(userId);

  const user = await currentUser();
  const displayName =
    user?.firstName ||
    user?.username ||
    user?.emailAddresses?.[0]?.emailAddress;

  const parsed = parseMonth(searchParams?.month);
  const base = parsed
    ? new Date(parsed.year, parsed.month - 1, 1)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const from = new Date(base.getFullYear(), base.getMonth(), 1);
  const to = new Date(base.getFullYear(), base.getMonth() + 1, 0);

  const prevKey = monthKey(addMonths(base, -1));
  const nextKey = monthKey(addMonths(base, 1));

  const locale = preferences.locale === "pt" ? "pt-PT" : "en-US";
  const periodLabel = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(base);

  const [summary, topCategories, recent, categories, subscriptions, goals] =
    await Promise.all([
      getMonthSummary({ userId, from: toIsoDate(from), to: toIsoDate(to) }),
      getTopCategories({ userId, from: toIsoDate(from), to: toIsoDate(to) }),
      getRecentTransactions({
        userId,
        from: toIsoDate(from),
        to: toIsoDate(to),
        limit: 20,
      }),
      getCategoriesForUser(userId),
      getSubscriptionsForUser(userId),
      getGoalsForUser(userId),
    ]);

  return (
    <DashboardClient
      currency={preferences.currency}
      locale={preferences.locale}
      displayName={displayName ?? ""}
      periodLabel={periodLabel}
      prevMonthHref={`/dashboard?month=${prevKey}`}
      nextMonthHref={`/dashboard?month=${nextKey}`}
      summary={summary}
      topCategories={topCategories}
      recent={recent}
      categories={categories}
      subscriptions={subscriptions}
      goals={goals}
    />
  );
}
