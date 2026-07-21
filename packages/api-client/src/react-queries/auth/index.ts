export const authQueries = {
  register: {
    key: ["register"],
    endpoint: "/auth/register",
  },
  login: {
    key: ["login"],
    endpoint: "/auth/login",
  },
  verifyOtp: {
    key: ["verify-otp"],
    endpoint: "/auth/verify-otp",
  },
  resendOtp: {
    key: ["resend-otp"],
    endpoint: "/auth/resend-otp",
  },
  refreshToken: {
    key: ["refresh-token"],
    endpoint: "/auth/refresh",
  },
} as const;
