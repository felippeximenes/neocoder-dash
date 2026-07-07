import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0F",
        surface: "#111118",
        "surface-hover": "#1A1A24",
        border: {
          DEFAULT: "#1E1E2E",
          accent: "#2D2D44",
        },
        text: {
          primary: "#F0F0FF",
          secondary: "#8888AA",
          muted: "#44445A",
        },
        brand: {
          blue: "#4F8EF7",
          green: "#34D399",
          yellow: "#FBBF24",
          red: "#F87171",
          purple: "#A78BFA",
          gray: "#6B7280",
        },
        client: {
          liberpay: "#7C3AED",
          neocoder: "#F59E0B",
          kotai: "#34D399",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
