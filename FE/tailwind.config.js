/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        beVietnamPro: ['"Be Vietnam Pro"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
