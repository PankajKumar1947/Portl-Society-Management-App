import { AMENITY_CATEGORIES, AMENITY_TYPES, AMENITY_STATUSES } from "./amenity.schema";

export const AMENITY_CATEGORY_OPTIONS = [
  { label: "All", value: "all" },
  ...AMENITY_CATEGORIES.map((c) => ({ label: c.replace(/_/g, " "), value: c })),
] as const;

export const AMENITY_TYPE_OPTIONS = [
  { label: "All", value: "all" },
  ...AMENITY_TYPES.map((t) => ({ label: t, value: t })),
] as const;

export const AMENITY_STATUS_OPTIONS = [
  { label: "All", value: "all" },
  ...AMENITY_STATUSES.map((s) => ({ label: s.replace(/_/g, " "), value: s })),
] as const;
