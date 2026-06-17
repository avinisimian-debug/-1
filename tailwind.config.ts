import type { Config } from "tailwindcss";

/**
 * Tailwind CSS v4 — companion config.
 *
 * Design tokens (colors, type, spacing, radii) live in `src/app/globals.css`
 * via `@theme` and CSS custom properties. This file handles framework concerns:
 * dark mode, content scanning, and future shadcn/ui plugins.
 *
 * @see https://tailwindcss.com/docs/v4-beta
 */
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      /* Semantic aliases — values defined in globals.css @theme */
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        /* rem-based type scale — 1rem = 16px */
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.02em" }],
        xs: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.01em" }],
        sm: ["0.875rem", { lineHeight: "1.25rem", letterSpacing: "0.005em" }],
        base: ["1rem", { lineHeight: "1.5rem", letterSpacing: "0" }],
        lg: ["1.125rem", { lineHeight: "1.75rem", letterSpacing: "-0.01em" }],
        xl: ["1.25rem", { lineHeight: "1.75rem", letterSpacing: "-0.015em" }],
        "2xl": ["1.5rem", { lineHeight: "2rem", letterSpacing: "-0.02em" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem", letterSpacing: "-0.025em" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem", letterSpacing: "-0.03em" }],
        "5xl": ["3rem", { lineHeight: "1.1", letterSpacing: "-0.035em" }],
      },
      spacing: {
        /* rem-based spacing scale (4px grid) */
        "4.5": "1.125rem",
        "13": "3.25rem",
        "15": "3.75rem",
        "18": "4.5rem",
        "22": "5.5rem",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow-md)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        focus: "var(--shadow-focus)",
      },
      transitionDuration: {
        fast: "100ms",
        DEFAULT: "150ms",
        slow: "250ms",
      },
      transitionTimingFunction: {
        DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
        out: "cubic-bezier(0, 0, 0.2, 1)",
        in: "cubic-bezier(0.4, 0, 1, 1)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pricing-glow-pulse": {
          "0%, 100%": {
            boxShadow:
              "0 0 0 1px rgb(99 102 241 / 0.25), 0 4px 24px rgb(99 102 241 / 0.12)",
          },
          "50%": {
            boxShadow:
              "0 0 0 1px rgb(99 102 241 / 0.45), 0 8px 32px rgb(99 102 241 / 0.18)",
          },
        },
        "discount-pop": {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "60%": { transform: "scale(1.05)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        shimmer: "shimmer 3s infinite",
        "pricing-glow": "pricing-glow-pulse 3s ease-in-out infinite",
        "discount-pop": "discount-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
