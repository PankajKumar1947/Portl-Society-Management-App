export const VISITOR_TYPE_OPTIONS = [
  { label: "Guest", value: "guest" },
  { label: "Delivery", value: "delivery" },
  { label: "Service Staff", value: "service_staff" },
  { label: "Cab", value: "cab" },
] as const;

export const PURPOSE_OPTIONS = [
  { label: "Personal Visit", value: "personal" },
  { label: "Delivery", value: "delivery" },
  { label: "Maintenance Work", value: "maintenance" },
  { label: "Other", value: "other" },
] as const;
