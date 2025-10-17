/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./app.html",
    "./admin.html",
    "./pricing.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        vazir: ['Vazir', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
