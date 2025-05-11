/** @type {import('tailwindcss').Config} */
plugins: [require('@tailwindcss/typography')],

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}


