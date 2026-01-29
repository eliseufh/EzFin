import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, currencyCode: string = "EUR") {
  // Configura a localidade baseada na moeda (cosmética)
  let locale = "pt-PT";
  if (currencyCode === "BRL") locale = "pt-BR";
  if (currencyCode === "USD") locale = "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  }).format(value);
}