import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: "#f9f6ed",
          100: "#efe8d2",
          200: "#e1d0a7",
          300: "#d0b274",
          400: "#c1974e",
          500: "#b28341",
          600: "#996936",
          700: "#7a4e2e",
          800: "#67412c",
          900: "#59382a",
          950: "#331d15",
        },
      },
      animation: {
        "slide-down": "slideDown 0.3s ease-out",
      },
      ketframes: {
        slideDown: {
          "0%": {
            transform: "translateY(-10%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
      },
      fontFamily: {
        heading: ['"Playfair Display"', "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
