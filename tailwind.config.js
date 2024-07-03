/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      colors: {
        bfgreen: {
          base: '#5FBB63',
          'base-light': '#6fc973',
          dark: '#388E3C',
          light: '#C8E6C9',
          white: '#F2FFF3',
        },
      },
    },
  },
  plugins: [],
}
