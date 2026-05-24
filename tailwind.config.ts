import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // deep violet-black — the dark canvas of a mind at night
        ink: {
          950: "#070510",
          900: "#0b0817",
          800: "#120d22",
          700: "#1b1432",
          600: "#291e48",
          500: "#3a2c63",
        },
        // ember — hunger, drive, craving, the warm heat of want (primary signal)
        ember: {
          600: "#d9701d",
          500: "#ff9d3c",
          400: "#ffb866",
          300: "#ffd6a1",
        },
        // flame — desire, pleasure, attraction, longing (the magenta pulse)
        flame: {
          600: "#d62f6a",
          500: "#ff3d80",
          400: "#ff6ba3",
          300: "#ff9fc4",
        },
        // mind — dopamine, reward, meaning, transcendence (the violet glow)
        mind: {
          600: "#7c3aed",
          500: "#a855f7",
          400: "#c084fc",
          300: "#d8b4fe",
        },
        // signal — attention, information, clarity, the electric blue of the feed
        signal: {
          600: "#0e9bc0",
          500: "#2dd4ee",
          400: "#67e3f7",
          300: "#a8eefb",
        },
        // text on ink — warm cool-leaning neutral
        ghost: {
          50: "#f7f3ff",
          100: "#e9e3f7",
          200: "#cabfe0",
          300: "#9a8fb6",
          500: "#675d80",
          700: "#3b3352",
        },
      },
      fontFamily: {
        display: ['"Sora"', "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ['"Spectral"', "ui-serif", "Georgia", "serif"],
        sans: ['"Manrope"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
        zh: ['"Noto Serif SC"', "serif"],
      },
      boxShadow: {
        glowember: "0 0 40px -8px rgba(255,157,60,0.55)",
        glowflame: "0 0 36px -8px rgba(255,61,128,0.5)",
        glowmind: "0 0 36px -8px rgba(168,85,247,0.5)",
        glowsignal: "0 0 36px -8px rgba(45,212,238,0.5)",
        card: "inset 0 1px 0 rgba(255,214,161,0.06), 0 24px 60px -28px rgba(0,0,0,0.94)",
      },
    },
  },
  plugins: [],
};

export default config;
