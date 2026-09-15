import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/frontend/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefdf4",
          100: "#d6f8e3",
          200: "#b0efcc",
          300: "#7bdfaa",
          400: "#43c982",
          500: "#20a965",
          600: "#14894f",
          700: "#116d42",
          800: "#115737",
          900: "#0f472f"
        },
        ink: "#13231b"
      },
      boxShadow: {
        soft: "0 16px 50px rgba(19, 35, 27, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
