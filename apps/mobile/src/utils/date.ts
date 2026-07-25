export type DateFormatVariant =
  | "short"
  | "long"
  | "withWeekday"
  | "time"
  | "timeWithSeconds"
  | "dateTime"
  | "monthYear"
  | "weekday";

const FORMATTERS: Record<DateFormatVariant, Intl.DateTimeFormatOptions> = {
  short: { month: "short", day: "numeric", year: "numeric" },
  long: { weekday: "long", month: "short", day: "numeric", year: "numeric" },
  withWeekday: { weekday: "short", month: "short", day: "numeric" },
  time: { hour: "2-digit", minute: "2-digit" },
  timeWithSeconds: { hour: "2-digit", minute: "2-digit", second: "2-digit" },
  dateTime: { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" },
  monthYear: { month: "long", year: "numeric" },
  weekday: { weekday: "short" },
};

export function formatDate(
  date: Date | string | null | undefined,
  variant: DateFormatVariant = "short",
  locale?: string,
): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "—";
  const opts = FORMATTERS[variant];
  const formatted = d.toLocaleDateString(locale ?? [], opts);
  if (variant === "weekday") return formatted.toUpperCase();
  return formatted;
}
