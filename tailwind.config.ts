import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "src/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  
  theme: {
    extend: {
      colors: {
        background: "var(--background)",  // Dynamic background
        foreground: "var(--foreground)",  // Dynamic text
        dark: "var(--dark)",              // Dynamic dark color
        lightGray: "var(--lightGray)",    // Dynamic light gray
        deepBlack: "var(--deepBlack)",    // Dynamic black
        deepBlack2: "var(--deepBlack2)",
        blue: "var(--blue)",              // Dynamic primary blue
        primaryWhite: "var(--primaryWhite)", // Dynamic white
        Orange: "var(--Orange)",          // Dynamic orange
        gray100: "var(--gray100)",        // Dynamic gray 100
        gray300: "var(--gray300)",        // Dynamic gray 300
        gray400: "var(--gray400)",        // Dynamic gray 400
        gray500: "var(--gray500)",        // Dynamic gray 500
        gray600: "var(--gray600)",        // Dynamic gray 600
        gray800: "var(--gray800)",        // Dynamic gray 800
      },
      screens: {
        'xxl': '1365px',
      },
    },
  },
  plugins: [],
};

export default config;
