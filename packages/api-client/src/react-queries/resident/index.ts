export const residentQueries = {
  create: {
    key: ["create-resident"],
    endpoint: "/residents",
  },
  list: (societyId?: string) => ({
    key: societyId ? ["residents-list", societyId] : ["residents-list"],
    endpoint: `/residents`,
  }),
  details: (residentId: string) => ({
    key: ["resident-details", residentId],
    endpoint: `/residents/${residentId}`,
  }),
  update: (residentId: string) => ({
    key: ["update-resident", residentId],
    endpoint: `/residents/${residentId}`,
  }),
  delete: (residentId: string) => ({
    key: ["delete-resident", residentId],
    endpoint: `/residents/${residentId}`,
  }),
  onboardPersonal: {
    key: ["onboard-personal"],
    endpoint: "/residents/onboard/personal",
  },
  onboardAllotment: {
    key: ["onboard-allotment"],
    endpoint: "/residents/onboard/allotment",
  },
  onboardVehicle: (residentId: string) => ({
    key: ["onboard-vehicle", residentId],
    endpoint: `/residents/onboard/vehicle/${residentId}`,
  }),
} as const;

