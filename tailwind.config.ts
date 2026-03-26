import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAF7F2",
        terracotta: {
          DEFAULT: "#C4704F",
          dark: "#A85A3C",
          light: "#D4906A",
        },
        sage: {
          DEFAULT: "#8B956D",
          dark: "#6B7455",
          light: "#A9B38A",
        },
        brown: {
          DEFAULT: "#6B4423",
          dark: "#4A2E16",
          light: "#8B6245",
        },
        sand: "#E8DCC8",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
