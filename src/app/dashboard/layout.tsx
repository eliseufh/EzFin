import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Wallet } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeToggle } from "./_components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { DashboardNav } from "./_components/dashboard-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Barra de Navegação Superior */}
      <header className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <Link
              href="/dashboard"
              className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2"
            >
              <Wallet className="h-6 w-6 text-green-600 dark:text-green-400" />
              <span className="hidden xs:block">EzFin</span>
            </Link>

            <DashboardNav />
          </div>

          {/* Botão de tema, idioma e UserButton */}
          <div className="flex items-center gap-2 justify-end min-w-10 z-110">
            <LanguageSwitcher />
            <ThemeToggle />
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-9 w-9", // Aumenta um pouco o tamanho do toque
                },
              }}
            />
          </div>
        </div>
      </header>

      {/* Conteúdo da Página */}
      <main>{children}</main>
      <Toaster richColors position="top-center" />
    </div>
  );
}
