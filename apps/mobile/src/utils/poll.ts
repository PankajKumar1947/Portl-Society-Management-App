import { formatDate } from "./date";

export function formatRemainingTime(expiresAt: string, status: string): string {
  if (status === "closed") {
    return `Ended ${formatDate(expiresAt, "short")}`;
  }
  if (status === "draft") return "Not published yet";

  const now = new Date();
  const end = new Date(expiresAt);
  const diffMs = end.getTime() - now.getTime();

  if (diffMs <= 0) return "Ending soon";

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (diffDays > 0) return `${diffDays}d ${diffHrs}h remaining`;
  return `${diffHrs}h remaining`;
}

export function getPollStatusBadgeConfig(status: string): { label: string; variant: "success" | "warning" | "secondary" } {
  switch (status) {
    case "published":
      return { label: "Live", variant: "success" };
    case "closed":
      return { label: "Closed", variant: "secondary" };
    default:
      return { label: "Draft", variant: "warning" };
  }
}

export const RECIPIENT_LABELS: Record<string, { label: string; variant: "success" | "warning" }> = {
  residents: { label: "Residents", variant: "success" },
  guard: { label: "Guards", variant: "warning" },
};
