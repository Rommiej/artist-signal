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
          deep:    "#060D1C",
          card:    "#0A1528",
          raised:  "#0F1E38",
          border:  "#152840",
        },
        ink: {
          primary:   "#F0F4FF",
          secondary: "#7A8DAA",
          tertiary:  "#3C526E",
          disabled:  "#1E3050",
        },
        umg: {
          blue:        "#2B7FE8",
          "blue-dim":  "#0D1E35",
          "blue-line": "#1A3558",
        },
        sig: {
          green:        "#00C776",
          "green-dim":  "#041E11",
          "green-line": "#0A3D22",
          amber:        "#F0A000",
          "amber-dim":  "#251800",
          "amber-line": "#3D2800",
          red:          "#E04848",
          "red-dim":    "#220E0E",
          "red-line":   "#3D1515",
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
        "2xl": "20px",
      },
    },
  },
  plugins: [],
};

export default config;
