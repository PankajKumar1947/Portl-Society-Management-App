export const theme = {
  colors: {
    primary: "#D3DB36",
    primaryDark: "#B8D100",
    primaryLight: "#EEF8B5",

    background: "#FAF9F5",
    surface: "#FFFFFF",
    surfaceSecondary: "#eceed68f",

    text: "#444852",
    textSecondary: "#5E6573",
    textMuted: "#9AA3AF",

    border: "#ECE8DD",

    success: "#1a9953ff",
    warning: "#FFB547",
    danger: "#FF5A5F",
    info: "#4D9FFF",
  },

  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 999,
  },

  fontWeights: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  } as const,

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    section: 40,
  },
};
