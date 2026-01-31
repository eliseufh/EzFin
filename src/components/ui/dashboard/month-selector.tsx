"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

export function MonthSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const month = parseInt(
    searchParams.get("month") || (new Date().getMonth() + 1).toString(),
  );
  const year = parseInt(
    searchParams.get("year") || new Date().getFullYear().toString(),
  );

  const date = new Date(year, month - 1);

  const handleNavigate = (direction: number) => {
    const newDate = new Date(year, month - 1 + direction);
    const newMonth = newDate.getMonth() + 1;
    const newYear = newDate.getFullYear();
    // Forçamos a atualização da URL
    router.push(`/dashboard?month=${newMonth}&year=${newYear}`);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center border dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 shadow-sm h-10 px-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleNavigate(-1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 px-3 min-w-[140px] justify-center border-x dark:border-slate-700">
          <CalendarIcon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <span className="text-sm font-medium capitalize dark:text-slate-200">
            {format(date, "MMMM yyyy", { locale: pt })}
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleNavigate(1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
