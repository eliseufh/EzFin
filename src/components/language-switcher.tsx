"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const languages = [
  { code: "pt", name: "Português", label: "PT" },
  { code: "en", name: "English", label: "EN" },
];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLang, setCurrentLang] = useState("pt");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "pt";
    setCurrentLang(savedLang);
    setMounted(true);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    localStorage.setItem("language", langCode);
    window.dispatchEvent(new Event("languageChange"));
    window.location.reload();
  };

  const currentLanguage = languages.find((lang) => lang.code === currentLang);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-white hover:bg-slate-800"
      >
        <Globe className="h-4 w-4" />
        <span className="font-semibold">PT</span>
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-white hover:bg-slate-800"
        >
          <Globe className="h-4 w-4" />
          <span className="font-semibold">{currentLanguage?.label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-48 bg-slate-900 border-slate-800"
        align="end"
      >
        <div className="space-y-1">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                currentLang === lang.code
                  ? "bg-green-500/20 text-green-400"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="font-bold text-base">{lang.label}</span>
              <span className="font-medium">{lang.name}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
