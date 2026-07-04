/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "slack-dark": {
          50: "#f1f3f8",
          100: "#d9dee9",
          200: "#b8c0d6",
          300: "#8f99c0",
          400: "#6a76ab",
          500: "#47527f",
          600: "#2f365f",
          700: "#242a49",
          800: "#1a1f37",
          900: "#14182d",
          950: "#0b0c10",
          DEFAULT: "#0b0c10",
          panel: "#111318",
          border: "rgba(255,255,255,0.08)",
          muted: "#a7a7b3",
          text: "#e7e7ea",
        },
        "slack-accent": {
          50: "#eafffb",
          100: "#c8fff4",
          200: "#93ffe9",
          300: "#4cffd4",
          400: "#18e2ba",
          500: "#00c59f",
          600: "#00a780",
          700: "#0d8065",
          800: "#0a6a53",
          900: "#075546",
          950: "#04352f",
          DEFAULT: "#00c59f",

          // indigo/blue state-ish ladder (for focus/hover/glow)
          indigo: {
            50: "#eef2ff",
            100: "#e0e7ff",
            200: "#c7d2fe",
            300: "#a5b4fc",
            400: "#818cf8",
            500: "#6366f1",
            600: "#4f46e5",
            700: "#4338ca",
            800: "#3730a3",
            900: "#312e81",
            950: "#1f1b4f",
          },

          // semantic helpers
          glow: "rgba(0,197,159,0.35)",
        },
      },

      boxShadow: {
        glow: "0 0 0 1px rgba(99,102,241,0.25), 0 10px 40px rgba(0,197,159,0.15)",
      },

      // Rounded component styling variables (so we can reuse in classnames)
      borderRadius: {
        'comp-sm': "var(--radius-comp-sm)",
        'comp-md': "var(--radius-comp-md)",
        'comp-lg': "var(--radius-comp-lg)",
        'comp-xl': "var(--radius-comp-xl)",
      },

      // Optional: semantic border widths
      borderWidth: {
        hairline: "1px",
      },
    },
  },
  plugins: [],
};

