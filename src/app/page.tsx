import { Button } from "@/components/ui/button"; // Do Shadcn UI
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50">
      <h1 className="text-4xl font-bold mb-6 text-slate-900">EzFin</h1>
      <p className="text-xl text-slate-600 mb-8">
        A gestão financeira simplificada para você controlar suas finanças pessoais com facilidade.
      </p>

      {/* Se o usuário NÃO estiver logado, mostra o botão de Entrar */}
      <SignedOut>
        <SignInButton mode="modal">
          <Button size="lg">Entrar Agora</Button>
        </SignInButton>
      </SignedOut>

      {/* Se o usuário JÁ estiver logado, mostra o botão do Dashboard e o Avatar */}
      <SignedIn>
        <div className="flex flex-col items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline">Ir para o Dashboard</Button>
          </Link>
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
    </main>
  );
}