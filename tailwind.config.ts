import type { Config } from "tailwindcss";
export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        muted: "#6b7280",
        surface: "#ffffff",
        border: "#d8e2f1",
        accent: "#118ab2",
        "accent-2": "#ef476f",
        orange: "#f4a261",
        yellow: "#ffb703",
        mint: "#06d6a0",
      },
      fontFamily: {
        sans: ["Space Grotesk", "Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["IBM Plex Mono", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      boxShadow: {
        'brain': '0 18px 60px rgba(15, 23, 42, 0.12)',
        'brain-sm': '0 10px 35px rgba(15, 23, 42, 0.08)',
        'accent': '0 10px 20px rgba(17, 138, 178, 0.22)',
        'accent-lg': '0 10px 20px rgba(17, 138, 178, 0.35)',
      },
      backdropBlur: {
        'glass': '12px',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
