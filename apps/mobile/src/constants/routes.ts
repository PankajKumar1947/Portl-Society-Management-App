export const Routes = {
  Root: "/",

  Home: "/(resident)",

  Onboarding: "/(onboarding)",
  Admin: "/(admin)",
  Guard: "/(guard)",

  Auth: {
    Login: "/login",
    Register: "/register",
    Verify: "/verify",
  },

  Helpdesk: "/(resident)/helpdesk",
  Bookings: "/(resident)/bookings",

  Visitors: {
    Index: "/(resident)/visitors",
    Create: "/(resident)/visitors/create",
    History: "/(resident)/visitors/history",
    Approval: (id: string) => ({
      pathname: "/(resident)/visitors/[id]/approval",
      params: { id },
    }),
    Pass: (id: string) => ({
      pathname: "/(resident)/visitors/[id]/pass",
      params: { id },
    }),
  },

  Amenities: {
    Index: "/(resident)/amenities",
    Details: (id: string) => ({
      pathname: "/(resident)/amenities/[id]",
      params: { id },
    }),
    Book: (id: string, name: string) => ({
      pathname: "/(resident)/amenities/[id]/book",
      params: { id, name },
    }),
    Confirm: (id: string, name: string, date: string, time: string) => ({
      pathname: "/(resident)/amenities/[id]/confirm",
      params: { id, name, date, time },
    }),
    Bookings: {
      Index: "/(resident)/amenities/bookings",
      Details: (id: string, name: string, date: string, time: string, status: string, bookingId: string) => ({
        pathname: "/(resident)/amenities/bookings/[id]",
        params: { id, name, date, time, status, bookingId },
      }),
    },
  },
} as const;
