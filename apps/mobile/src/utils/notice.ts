export function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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
