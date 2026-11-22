/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FAF8F5",
        navy: "#102132",
        sky: "#9EC1DF",
        coral: "#E66C5A"
      }
    }
  },
  plugins: []
};
