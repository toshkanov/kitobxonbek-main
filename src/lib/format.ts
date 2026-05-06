export function formatPrice(amount: number, locale: string = "uz"): string {
  const map: Record<string, string> = { uz: "uz-UZ", ru: "ru-RU", en: "en-US" };
  return new Intl.NumberFormat(map[locale] ?? "uz-UZ", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(value: string | Date, locale: string = "uz"): string {
  const map: Record<string, string> = { uz: "uz-UZ", ru: "ru-RU", en: "en-US" };
  const d = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat(map[locale] ?? "uz-UZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}
