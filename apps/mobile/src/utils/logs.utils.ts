import { VisitorLogData, SCAN_DIRECTION } from "@repo/schema";
import { formatDate } from "./date";

export interface LogEvent {
  id: string;
  timestamp: string;
  action: string;
  visitorName: string;
  visitorType: string;
  towerName: string | null;
  flatNumber: string | null;
  residentName: string;
  scannedBy: string | null;
}

export type DateFilter = "today" | "yesterday" | "week" | "all" | "custom";

export const DATE_FILTER_OPTIONS: { key: DateFilter; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "week", label: "This Week" },
  { key: "custom", label: "Custom" },
  { key: "all", label: "All" },
];

export function formatTime(iso: string): string {
  return formatDate(iso, "timeWithSeconds");
}

export function formatSectionDate(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return formatDate(iso, "long");
}

export function formatPickerDate(d: Date): string {
  return formatDate(d, "short");
}

export function getDateRange(filter: DateFilter, customFrom?: Date, customTo?: Date): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  if (filter === "today") return { start, end };

  if (filter === "yesterday") {
    start.setDate(start.getDate() - 1);
    end.setDate(end.getDate() - 1);
    return { start, end };
  }

  if (filter === "week") {
    start.setDate(start.getDate() - 6);
    return { start, end };
  }

  if (filter === "custom" && customFrom && customTo) {
    const cs = new Date(customFrom);
    cs.setHours(0, 0, 0, 0);
    const ce = new Date(customTo);
    ce.setHours(23, 59, 59, 999);
    return { start: cs, end: ce };
  }

  start.setFullYear(2000);
  return { start, end };
}

export function extractEvents(logs: VisitorLogData[], towerMap: Map<string, string>): LogEvent[] {
  const events: LogEvent[] = [];

  for (const log of logs) {
    const towerName = log.flat?.towerId ? towerMap.get(log.flat?.towerId) ?? null : null;
    const flatNumber = log.flat?.flatNumber ?? null;
    const residentName = log.resident
      ? `${log.resident.firstName || ""} ${log.resident.lastName || ""}`.trim()
      : "—";

    for (const entry of log.entries || []) {
      if (entry.enteredAt) {
        events.push({
          id: `${log.logId}-entry-${entry.enteredAt}`,
          timestamp: entry.enteredAt,
          action: SCAN_DIRECTION.ENTRY,
          visitorName: log.name,
          visitorType: log.type,
          towerName,
          flatNumber,
          residentName,
          scannedBy: entry.scannedBy ?? null,
        });
      }
      if (entry.exitedAt) {
        events.push({
          id: `${log.logId}-exit-${entry.exitedAt}`,
          timestamp: entry.exitedAt,
          action: SCAN_DIRECTION.EXIT,
          visitorName: log.name,
          visitorType: log.type,
          towerName,
          flatNumber,
          residentName,
          scannedBy: entry.scannedBy ?? null,
        });
      }
    }
  }

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function groupByDate(events: LogEvent[]): { title: string; data: LogEvent[] }[] {
  const groups: Record<string, LogEvent[]> = {};

  for (const event of events) {
    const dateKey = new Date(event.timestamp).toDateString();
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(event);
  }

  return Object.entries(groups)
    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
    .map(([dateKey, data]) => ({
      title: formatSectionDate(dateKey),
      data,
    }));
}
