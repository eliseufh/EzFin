"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Evita mismatch de hidratação
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon-sm">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
      ) : (
        <Sun className="h-4 w-4 text-slate-600 dark:text-slate-400" />
      )}
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
}
