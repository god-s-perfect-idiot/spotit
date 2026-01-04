/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          300: '#FF8D7B',
          400: '#FF6961',
          500: '#FF6961',
          600: '#E55A5A',
        }
      }
    },
  },
  plugins: [],
}
