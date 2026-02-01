import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/pricing",
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();
  const { pathname } = request.nextUrl;

  // Detecção automática de idioma (apenas se não houver cookie de idioma)
  const savedLanguage = request.cookies.get("language")?.value;
  
  let response: NextResponse;

  // Se não está logado e tenta acessar rota protegida
  if (!userId && !isPublicRoute(request)) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect_url", pathname);
    response = NextResponse.redirect(signInUrl);
  }
  else {
    response = NextResponse.next();
  }

  // Detecta o idioma do navegador se não houver cookie
  if (!savedLanguage) {
    const acceptLanguage = request.headers.get("accept-language");
    let detectedLocale = "pt"; // Idioma padrão

    if (acceptLanguage) {
      const primaryLanguage = acceptLanguage.split(",")[0].split("-")[0].toLowerCase();
      if (primaryLanguage === "en") {
        detectedLocale = "en";
      }
    }

    // Define o cookie com o idioma detectado
    response.cookies.set("language", detectedLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 ano
    });
  }

  return response;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};