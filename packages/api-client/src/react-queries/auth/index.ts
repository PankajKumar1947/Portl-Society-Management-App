export const authQueries = {
  register: {
    key: ["register"],
    endpoint: "/api/v1/auth/register",
  },
  login: {
    key: ["login"],
    endpoint: "/api/v1/auth/login",
  },
  verifyOtp: {
    key: ["verify-otp"],
    endpoint: "/api/v1/auth/verify-otp",
  },
  resendOtp: {
    key: ["resend-otp"],
    endpoint: "/api/v1/auth/resend-otp",
  },
} as const;
