/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: "#FAFAF7",
        fg: "#1A1A1A",
        muted: "#6B6B6B",
        accent: "#5B8DEF",
        soft: "#F0EDE6",
        success: "#7CB88F",
      },
    },
  },
  plugins: [],
};
