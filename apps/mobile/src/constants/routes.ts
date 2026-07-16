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
      pathname: "/(resident)/visitors/[id]/approval" as const,
      params: { id },
    }),
    Pass: (id: string) => ({
      pathname: "/(resident)/visitors/[id]/pass" as const,
      params: { id },
    }),
  },

  Amenities: {
    Index: "/(resident)/amenities" as const,
    Details: (id: string) => ({
      pathname: "/(resident)/amenities/[id]" as const,
      params: { id },
    }),
    Book: (id: string, name: string) => ({
      pathname: "/(resident)/amenities/[id]/book" as const,
      params: { id, name },
    }),
    Confirm: (id: string, name: string, date: string, time: string) => ({
      pathname: "/(resident)/amenities/[id]/confirm" as const,
      params: { id, name, date, time },
    }),
    Bookings: {
      Index: "/(resident)/amenities/bookings" as const,
      Details: (id: string, name: string, date: string, time: string, status: string, bookingId: string) => ({
        pathname: "/(resident)/amenities/bookings/[id]" as const,
        params: { id, name, date, time, status, bookingId },
      }),
    },
  },
} as const;
