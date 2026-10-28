/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0b2545',
          blue: '#134074',
          dark: '#081726',
          bg: '#f4f6f9',
          card: '#ffffff',
          border: '#d1d5db',
          header: '#0d2033',
          saffron: '#FF9933',
          green: '#138808'
        }
      },
      fontFamily: {
        sans: ['"Segoe UI"', 'Roboto', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
