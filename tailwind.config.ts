import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
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
