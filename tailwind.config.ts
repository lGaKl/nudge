import type { Config } from "tailwindcss";
import { colors, colorsDark, typography } from "./lib/theme";

const config: Config = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ...colors,
        "bg-dark": colorsDark.bg,
        "fg-dark": colorsDark.fg,
        "muted-dark": colorsDark.muted,
        "accent-dark": colorsDark.accent,
        "soft-dark": colorsDark.soft,
        "success-dark": colorsDark.success,
      },
      fontSize: {
        micro: [`${typography.micro.size}px`, `${typography.micro.lineHeight}px`],
        caption: [`${typography.caption.size}px`, `${typography.caption.lineHeight}px`],
        body: [`${typography.body.size}px`, `${typography.body.lineHeight}px`],
        title: [`${typography.title.size}px`, `${typography.title.lineHeight}px`],
        display: [`${typography.display.size}px`, `${typography.display.lineHeight}px`],
      },
      fontFamily: {
        rounded: ['"SF Pro Rounded"', "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
