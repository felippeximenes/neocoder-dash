import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#04050C",
        surface: "rgba(10,11,26,0.55)",
        "surface-solid": "#0A0A1E",
        "surface-hover": "rgba(20,21,44,0.7)",
        border: {
          DEFAULT: "rgba(120,90,200,0.15)",
          accent: "rgba(139,92,246,0.4)",
        },
        text: {
          primary: "#E7E8F2",
          secondary: "#9498B2",
          muted: "#6B6F8A",
        },
        brand: {
          blue: "#6366F1",
          green: "#2EE6C8",
          yellow: "#FBBF24",
          red: "#F87171",
          purple: "#A855F7",
          gray: "#8A8FA8",
        },
        client: {
          liberpay: "#7C3AED",
          neocoder: "#F59E0B",
          kotai: "#2EE6C8",
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
        display: ["var(--font-sora)", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
