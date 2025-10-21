// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")], // ✅ This line is required!
  theme: {
    extend: {
      colors: {
        primary: {
          50: "hsl(173 70% 90%)",
          100: "hsl(173 70% 82%)",
          200: "hsl(173 69% 72%)",
          300: "hsl(173 69% 62%)",
          400: "hsl(173 69% 55%)",
          500: "hsl(173 69% 47%)", // main
          600: "hsl(173 69% 40%)",
          700: "hsl(173 69% 33%)",
          800: "hsl(173 69% 27%)",
          900: "hsl(173 69% 20%)",
        },

        gold: {
          50: "hsl(51 70% 92%)",
          100: "hsl(51 65% 84%)",
          200: "hsl(51 60% 74%)",
          300: "hsl(51 55% 66%)",
          400: "hsl(51 50% 60%)",
          500: "hsl(51 46% 56%)", // main
          600: "hsl(51 42% 50%)",
          700: "hsl(51 38% 44%)",
          800: "hsl(51 34% 38%)",
          900: "hsl(51 30% 32%)",
        },
      },
    },
  },
  screens: {
    sm: 360, // small phones
    md: 768, // tablets
  },
  plugins: [],
  darkMode: "class", // for toggling manually
  experimental: {
    nativewind: true, // allows using plain components without styled()
  },
};
