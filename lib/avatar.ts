import { avatarPalette } from "./theme";

function hashToIndex(s: string, modulo: number): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % modulo;
}

export function avatarColors(
  title: string,
  scheme: "light" | "dark" | null | undefined,
): { bg: string; fg: string } {
  const palette = avatarPalette[hashToIndex(title, avatarPalette.length)];
  if (!palette) return { bg: "#E0E0E0", fg: "#1A1A1A" };
  return scheme === "dark"
    ? { bg: palette.bgDark, fg: palette.fgDark }
    : { bg: palette.bg, fg: palette.fg };
}

export function heroTint(
  title: string,
  scheme: "light" | "dark" | null | undefined,
): { bg: string; fg: string; muted: string } {
  const palette = avatarPalette[hashToIndex(title, avatarPalette.length)];
  if (!palette) return { bg: "#F0EDE6", fg: "#1A1A1A", muted: "#6B6B6B" };
  if (scheme === "dark") {
    return { bg: palette.bgDark, fg: palette.fgDark, muted: palette.fgDark + "B3" };
  }
  return { bg: palette.bg, fg: palette.fg, muted: palette.fg + "B3" };
}

export function avatarInitial(title: string): string {
  const trimmed = title.trim();
  if (trimmed.length === 0) return "?";
  return trimmed.charAt(0).toUpperCase();
}
