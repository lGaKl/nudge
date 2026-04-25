export const colors = {
  bg: "#FAFAF7",
  fg: "#1A1A1A",
  muted: "#6B6B6B",
  accent: "#5B8DEF",
  soft: "#F0EDE6",
  success: "#7CB88F",
} as const;

export const colorsDark = {
  bg: "#121212",
  fg: "#F5F5F0",
  muted: "#9A9A9A",
  accent: "#7BA8FF",
  soft: "#1F1F1F",
  success: "#8FCFA3",
} as const;

export const alpha = {
  placeholder: colors.muted + "80",
  placeholderDark: colorsDark.muted + "80",
} as const;

export const typography = {
  display: { size: 32, lineHeight: 40, weight: "700" as const },
  title: { size: 22, lineHeight: 28, weight: "600" as const },
  body: { size: 16, lineHeight: 24, weight: "400" as const },
  caption: { size: 13, lineHeight: 18, weight: "400" as const },
  micro: { size: 11, lineHeight: 14, weight: "400" as const },
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  fab: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

export const avatarPalette = [
  { bg: "#F4D2D7", bgDark: "#5D3A40", fg: "#7A2A36", fgDark: "#FBD7DD" },
  { bg: "#D4E0F4", bgDark: "#2E3F5E", fg: "#274E8B", fgDark: "#CCE0FF" },
  { bg: "#D4EDD9", bgDark: "#274838", fg: "#2C6D43", fgDark: "#C8EAD2" },
  { bg: "#F4E8C9", bgDark: "#5A4A1F", fg: "#7A5A12", fgDark: "#F5E5B5" },
  { bg: "#E0D4F4", bgDark: "#3D3559", fg: "#503C84", fgDark: "#DCCFFF" },
  { bg: "#F4DBC2", bgDark: "#5A3F22", fg: "#8A4F1A", fgDark: "#F4D5B0" },
] as const;

export const animation = {
  duration: {
    fast: 180,
    base: 280,
    slow: 380,
  },
  spring: {
    damping: 18,
    stiffness: 220,
    mass: 0.8,
  },
} as const;
