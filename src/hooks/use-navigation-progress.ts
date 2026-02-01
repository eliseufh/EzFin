"use client";

import { useEffect } from "react";
import NProgress from "nprogress";

export function useNavigationProgress() {
  useEffect(() => {
    // Intercepta todos os cliques em links
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      
      if (link && link.href && !link.href.startsWith("#") && link.target !== "_blank") {
        // Verifica se é uma navegação interna
        const url = new URL(link.href);
        if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
          NProgress.start();
        }
      }
    };

    // Adiciona listener de cliques
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
}
