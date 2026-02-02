import { HomeContent } from "@/components/home-content";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Força renderização dinâmica para verificar auth em tempo real
export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await currentUser();

  // Se o usuário está logado, redireciona para o dashboard
  if (user) {
    redirect("/dashboard");
  }

  return <HomeContent />;
}
