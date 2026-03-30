import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        head: ["Orbitron", "sans-serif"],
        ui:   ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        bg:      "#05070d",
        bg2:     "#0a0e1a",
        bg3:     "#0d1220",
        purple:  "#7c3aed",
        blue:    "#0ea5e9",
        pink:    "#f472b6",
        green:   "#10b981",
        cyan:    "#06b6d4",
        amber:   "#f59e0b",
        muted:   "#8b949e",
      },
      animation: {
        "glow-pulse":  "glow-pulse 2s ease-in-out infinite",
        "float":       "float 3s ease-in-out infinite",
        "flicker":     "flicker 4s ease-in-out infinite",
        "heartbeat":   "heartbeat 1s ease-in-out infinite",
        "led-blink":   "led-blink 2s ease infinite",
        "shimmer":     "shimmer 1.5s infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;