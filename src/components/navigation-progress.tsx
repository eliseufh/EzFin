"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import { useNavigationProgress } from "@/hooks/use-navigation-progress";

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.08,
});

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Hook para iniciar NProgress ao clicar em links
  useNavigationProgress();

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  return null;
}
