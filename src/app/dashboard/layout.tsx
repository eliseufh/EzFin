import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { LayoutDashboard, Settings, Wallet } from "lucide-react";
import { Toaster } from "@/components/ui/sonner"; // Importação do Sonner

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barra de Navegação Superior */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/dashboard" className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Wallet className="h-6 w-6 text-green-600" />
              <span className="hidden xs:block">EzFin</span>
            </Link>
            
            <nav className="flex items-center gap-3 md:gap-6 text-xs md:text-sm font-medium text-slate-600">
              <Link href="/dashboard" className="hover:text-green-600 flex items-center gap-1">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Visão Geral</span>
              </Link>
              <Link href="/dashboard/settings" className="hover:text-green-600 flex items-center gap-1">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Ajustes</span>
              </Link>
            </nav>
          </div>

          {/* O UserButton precisa de espaço para o toque no mobile */}
          <div className="flex items-center justify-end min-w-[40px] z-[110]">
            <UserButton 
              afterSignOutUrl="/" 
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-9 w-9", // Aumenta um pouco o tamanho do toque
                }
              }}
            />
          </div>
        </div>
      </header>

      {/* Conteúdo da Página */}
      <main>
        {children}
      </main>
      <Toaster richColors theme="light" position="top-center" /> {/* Componente do Sonner */}
    </div>
  );
}