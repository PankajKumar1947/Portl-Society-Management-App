import { formatDate } from "./date";

export function formatNoticeDate(dateStr?: string): string {
  if (!dateStr) return "";
  return formatDate(dateStr, "short");
}

export function isRecent(dateStr?: string): boolean {
  if (!dateStr) return false;
  const now = new Date();
  const date = new Date(dateStr);
  const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
}

export function roleLabel(role?: string): string {
  switch (role) {
    case "ADMIN": return "Owner";
    case "GUARD": return "Guard";
    case "RESIDENTS": return "Resident";
    default: return role || "";
  }
}
