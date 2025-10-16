// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")], // ✅ This line is required!
  theme: {
    extend: {},
  },
  plugins: [],
};
