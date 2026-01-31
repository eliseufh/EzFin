import { NextResponse } from "next/server";
import { checkSubscription } from "@/lib/subscription";

export async function GET() {
  try {
    const hasActiveSubscription = await checkSubscription();
    
    return NextResponse.json({ 
      hasActiveSubscription 
    });
  } catch (error) {
    console.error("Erro ao verificar subscrição:", error);
    return NextResponse.json(
      { hasActiveSubscription: false },
      { status: 200 }
    );
  }
}
