const app = <T extends string>(path: T) => `${path}` as const;

export const Routes = {
  Root: "/",

  App: app("/(app)"),

  Onboarding: {
    Index: "/(onboarding)",
    SetupSociety: "/(onboarding)/setup-society",
  },

  Auth: {
    Login: "/login",
    Register: "/register",
    Verify: "/verify",
    ForgotPassword: "/forgot-password",
    ResetPassword: "/reset-password",
  },

  Helpdesk: {
    Index: app("/helpdesk"),
    Create: app("/helpdesk/create"),
    Details: (id: string) => ({
      pathname: app("/helpdesk/[id]"),
      params: { id },
    }),
  },
  Complaints: {
    Index: app("/complaints"),
    Create: app("/complaints/create"),
    Details: (id: string) => ({
      pathname: app("/complaints/[id]"),
      params: { id },
    }),
  },
  Polls: {
    Index: app("/polls"),
    Create: app("/polls/create"),
    Details: (id: string) => ({
      pathname: app("/polls/[id]"),
      params: { id },
    }),
  },
  Bookings: app("/bookings"),
  Notifications: app("/notifications"),
  Profile: {
    Index: app("/profile"),
    MyFamily: app("/profile/family"),
    AddFamily: app("/profile/family/add"),
    EditProfile: app("/profile/edit"),
    Settings: app("/profile/settings"),
    Support: app("/profile/support"),
    About: app("/profile/about"),
    Vehicles: app("/profile/vehicles"),
    AddVehicle: app("/profile/vehicles/add"),
  },

  Society: {
    Index: app("/society"),
    Edit: app("/society/edit"),
  },

  Towers: {
    Index: app("/towers"),
    Create: app("/towers/create"),
    Details: (id: string) => ({
      pathname: app("/towers/[id]"),
      params: { id },
    }),
    Edit: (id: string) => ({
      pathname: app("/towers/[id]/edit"),
      params: { id },
    }),
    Flats: {
      Create: (towerId: string) => ({
        pathname: app("/towers/[id]/flats/create"),
        params: { id: towerId },
      }),
      Details: (towerId: string, flatId: string) => ({
        pathname: app("/towers/[id]/flats/[flatId]"),
        params: { id: towerId, flatId },
      }),
      Edit: (towerId: string, flatId: string) => ({
        pathname: app("/towers/[id]/flats/[flatId]/edit"),
        params: { id: towerId, flatId },
      }),
    },
  },

  Community: {
    Index: app("/community"),
  },
  Notices: {
    Index: app("/notices"),
    Create: app("/notices/create"),
    Details: (id: string) => ({
      pathname: app("/notices/[id]"),
      params: { id },
    }),
    Edit: (id: string) => ({
      pathname: app("/notices/[id]/edit"),
      params: { id },
    }),
  },

  Visitors: {
    Index: app("/visitors"),
    Create: app("/visitors/create"),
    Scan: app("/visitors/scan"),
    Logs: app("/visitors/logs"),
    Approval: (id: string) => ({
      pathname: app("/visitors/[id]/approval"),
      params: { id },
    }),
    Pass: (id: string) => ({
      pathname: app("/visitors/[id]/pass"),
      params: { id },
    }),
  },

  Amenities: {
    Index: app("/amenities"),
    Create: app("/amenities/create"),
    Details: (id: string) => ({
      pathname: app("/amenities/[id]"),
      params: { id },
    }),
    Edit: (id: string) => ({
      pathname: app("/amenities/[id]/edit"),
      params: { id },
    }),
    Book: (id: string, name: string) => ({
      pathname: app("/amenities/[id]/book"),
      params: { id, name },
    }),
    Confirm: (id: string, name: string, date: string, time: string) => ({
      pathname: app("/amenities/[id]/confirm"),
      params: { id, name, date, time },
    }),
    Bookings: {
      Index: app("/amenities/bookings"),
      Details: (id: string, name: string, date: string, time: string, status: string, bookingId: string) => ({
        pathname: app("/amenities/bookings/[id]"),
        params: { id, name, date, time, status, bookingId },
      }),
    },
  },

  Residents: {
    Index: app("/residents"),
    Create: app("/residents/create"),
    Details: (id: string) => ({
      pathname: app("/residents/[id]"),
      params: { id },
    }),
    Edit: (id: string) => ({
      pathname: app("/residents/[id]/edit"),
      params: { id },
    }),
  },

  Guards: {
    Index: app("/guards"),
    Create: app("/guards/create"),
    Details: (id: string) => ({
      pathname: app("/guards/[id]"),
      params: { id },
    }),
    Edit: (id: string) => ({
      pathname: app("/guards/[id]/edit"),
      params: { id },
    }),
  },
} as const;
