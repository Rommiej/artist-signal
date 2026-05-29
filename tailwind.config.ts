import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          page:   "#EEF2F9",
          card:   "#FFFFFF",
          raised: "#F4F7FC",
          border: "#D0D8EE",
          "border-strong": "#B8C4E0",
        },
        ink: {
          primary:   "#0D1633",
          secondary: "#5A6A99",
          tertiary:  "#8E9BBF",
          disabled:  "#C4CEEA",
        },
        umg: {
          blue:        "#2B5FD9",
          "blue-light": "#EEF3FE",
          "blue-mid":  "#D0DEFA",
        },
        sig: {
          green:        "#157A52",
          "green-light": "#E6F5EE",
          "green-mid":  "#B8E5D0",
          amber:        "#A05C0A",
          "amber-light": "#FEF3E2",
          "amber-mid":  "#FAD898",
          red:          "#C0392B",
          "red-light":  "#FDECEA",
          "red-mid":    "#F5B8B3",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        sm:  "5px",
        md:  "8px",
        lg:  "11px",
        xl:  "16px",
      },
    },
  },
  plugins: [],
};

export default config;
