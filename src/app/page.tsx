import { HomeContent } from "@/components/home-content";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();

  // Se o usuário está logado, redireciona para o dashboard
  if (user) {
    redirect("/dashboard");
  }

  return <HomeContent />;
}
