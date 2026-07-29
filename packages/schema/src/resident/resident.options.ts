export const RESIDENT_TYPE_OPTIONS = [
  { label: "Single", value: "SINGLE" },
  { label: "Family", value: "FAMILY" },
  { label: "Couple", value: "COUPLE" },
] as const;

export const RELATIONSHIP_OPTIONS = [
  { label: "Spouse", value: "SPOUSE" },
  { label: "Son", value: "SON" },
  { label: "Daughter", value: "DAUGHTER" },
  { label: "Father", value: "FATHER" },
  { label: "Mother", value: "MOTHER" },
  { label: "Brother", value: "BROTHER" },
  { label: "Sister", value: "SISTER" },
  { label: "Other", value: "OTHER" },
] as const;

export const OWNERSHIP_OPTIONS = [
  { label: "Owner", value: "OWNER" },
  { label: "Tenant", value: "TENANT" },
  { label: "Co-Owner", value: "CO-OWNER" },
] as const;

export const VEHICLE_TYPE_OPTIONS = [
  { label: "None", value: "NONE" },
  { label: "2 Wheeler", value: "TWO_WHEELER" },
  { label: "4 Wheeler", value: "FOUR_WHEELER" },
] as const;

export const DOC_TYPE_OPTIONS = [
  { label: "None", value: "NONE" },
  { label: "Aadhar Card", value: "AADHAR" },
  { label: "PAN Card", value: "PAN" },
  { label: "Passport", value: "PASSPORT" },
  { label: "Voter ID", value: "VOTER_ID" },
] as const;
