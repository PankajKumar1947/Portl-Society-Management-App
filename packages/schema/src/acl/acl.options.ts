export const AclResource = {
  RESIDENTS: "residents",
  FAMILY_MEMBERS: "familyMembers",
  GUARDS: "guards",
  SOCIETY: "society",
  TOWERS: "towers",
  FLATS: "flats",
  AMENITIES: "amenities",
  NOTICES: "notices",
  POLLS: "polls",
  COMPLAINTS: "complaints",
  HELPDESK_TICKETS: "helpdeskTickets",
  MEDIA: "media",
  USERS: "users",
} as const;

export type AclResourceName = (typeof AclResource)[keyof typeof AclResource];
