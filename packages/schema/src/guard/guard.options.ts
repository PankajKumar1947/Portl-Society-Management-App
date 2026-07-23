export const SHIFT_OPTIONS = [
  { label: "Day Shift", value: "DAY" },
  { label: "Night Shift", value: "NIGHT" },
  { label: "Routine Shift", value: "ROUTINE" },
] as const;

export const GATE_OPTIONS = [
  { label: "Gate 1 (Main Entry)", value: "Gate 1" },
  { label: "Gate 2 (Back Exit)", value: "Gate 2" },
  { label: "Gate 3 (Service Entry)", value: "Gate 3" },
] as const;

export const POLICE_OPTIONS = [
  { label: "Verified", value: "VERIFIED" },
  { label: "Pending", value: "PENDING" },
  { label: "Not Done", value: "NOT_DONE" },
] as const;

export const GUARD_STATUS_OPTIONS = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "On Leave", value: "ON_LEAVE" },
] as const;