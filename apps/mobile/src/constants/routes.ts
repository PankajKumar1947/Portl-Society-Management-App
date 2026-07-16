const app = <T extends string>(path: T) => `${path}` as const;

export const Routes = {
  Root: "/",

  App: app(""),

  Onboarding: "/(onboarding)",

  Auth: {
    Login: "/login",
    Register: "/register",
    Verify: "/verify",
  },

  Helpdesk: {
    Index: app("/helpdesk"),
    Create: app("/helpdesk/create"),
    Details: (id: string) => ({
      pathname: app("/helpdesk/[id]"),
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
  },

  Visitors: {
    Index: app("/visitors"),
    Create: app("/visitors/create"),
    History: app("/visitors/history"),
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
} as const;
