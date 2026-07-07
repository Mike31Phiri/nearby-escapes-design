import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── Shadcn/ui CSS-variable tokens (keep for UI lib compat) ─────────
      colors: {
        border:      "var(--border)",
        input:       "var(--input)",
        ring:        "var(--ring)",
        background:  "var(--background)",
        foreground:  "var(--foreground)",
        primary: {
          DEFAULT:    "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT:    "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT:    "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT:    "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT:    "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT:    "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT:    "var(--card)",
          foreground: "var(--card-foreground)",
        },

        // ─── NEARBY ESCAPES BRAND TOKENS ─────────────────────────────────
        // Four families only: Purple · Gold · White · Black
        // Use these Tailwind classes everywhere in components.
        // Never put raw hex values in JSX.

        // PURPLE — primary brand color, the "Zambian twilight"
        purple: {
          DEFAULT: "var(--color-purple)",       // #1f1433 — all brand usage
          hover:   "var(--color-purple-hover)",  // #2A154A — links/button hover
          deep:    "var(--color-purple-deep)",   // #150d25 — dark overlays, hero bg
          muted:   "var(--color-purple-muted)",  // rgba(31,20,51,0.10) — tinted icon bg
          border:  "var(--color-purple-border)", // rgba(31,20,51,0.20) — bordered containers
        },

        // GOLD — CTA, highlights, wordmark accent
        gold: {
          DEFAULT: "var(--color-gold)",          // #f2ba0d — primary CTA bg
          hover:   "var(--color-gold-hover)",    // #d4b065 — CTA hover
          muted:   "var(--color-gold-muted)",    // rgba(242,186,13,0.15) — tinted panels
        },

        // WHITE — backgrounds and surfaces
        white: {
          DEFAULT: "var(--color-white)",         // #FFFFFF — pure white surface
          warm:    "var(--color-white-warm)",    // #FDFBF7 — page canvas
          soft:    "var(--color-white-soft)",    // #F9F7F2 — section panels
          bone:    "var(--color-white-bone)",    // #F0EAE0 — image placeholders
        },

        // BLACK — text and high-contrast elements
        black: {
          DEFAULT: "var(--color-black)",         // #111111 — headings, max contrast
          soft:    "var(--color-black-soft)",    // #333333 — body copy
          muted:   "var(--color-black-muted)",   // #666666 — supporting/muted text
          faint:   "var(--color-black-faint)",   // #999999 — captions, placeholders
        },
      },

      borderRadius: {
        lg:  "var(--radius)",
        md:  "calc(var(--radius) - 2px)",
        sm:  "calc(var(--radius) - 4px)",
        xl2: "1rem", // 16 px — consistent card/panel radius
      },

      fontFamily: {
        sans:    ["var(--font-sans)",    "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-sans)",    "ui-sans-serif", "system-ui", "sans-serif"],
        script:  ["var(--font-script)",  "cursive"],
      },

      boxShadow: {
        card:           "var(--shadow-card-sm)",
        "card-hover":   "var(--shadow-card)",
        "card-lg":      "var(--shadow-card)",
        "card-lg-hover":"var(--shadow-card-hover)",
        panel:          "0 1px 3px rgba(31, 20, 51, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
