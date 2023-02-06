/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'up': '0 -1px 3px 0 rgb(0, 0, 0)'
      }
    },
    colors: { ...colors,
      'roxo': '#342a54',
      'dourado': '#bfa15f',
      'dark': {
        900: "#2E2E2E",
        500: "#383B40",
        50: "#E7E7E7"
      },
      'light': {
        900: "#FFFFFF",
        500: "#FAFAFA",
        50: "#000000"
      }
    }
  },
  darkMode: "class",
  plugins: [],
}