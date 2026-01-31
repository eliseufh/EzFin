import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { LayoutDashboard, Settings, Wallet } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeToggle } from "./_components/theme-toggle";

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

            <nav className="flex items-center gap-3 md:gap-6 text-xs md:text-sm font-medium text-slate-600 dark:text-slate-300">
              <Link
                href="/dashboard"
                className="hover:text-green-600 dark:hover:text-green-400 flex items-center gap-1"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Visão Geral</span>
              </Link>
              <Link
                href="/dashboard/settings"
                className="hover:text-green-600 dark:hover:text-green-400 flex items-center gap-1"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Ajustes</span>
              </Link>
            </nav>
          </div>

          {/* Botão de tema e UserButton */}
          <div className="flex items-center gap-2 justify-end min-w-10 z-110">
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
