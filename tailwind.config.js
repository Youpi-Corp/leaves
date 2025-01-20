/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        bfgreen: {
          base: '#5FBB63',
          dark: '#388E3C',
          darker: '#285C2B',
          light: '#C8E6C9',
          lighter: '#E0F5E1',
          white: '#F2FFF3',
        },
        bfbase: {
          black: '#222222',
          grey: '#ACACAC',
          darkgrey: '#515151',
          lightgrey: '#F2F2F2',
        },
        bfbrown: {
          base: '#795548',
          dark: '#4F382F',
          light: '#D7CCC8',
        },
        bfblue: {
          base: '#344CB7',
          dark: '#1A237E',
          light: '#E8ECFA',
        },
        bfred: {
          base: '#D84040',
          dark: '#A62727',
          light: '#FFDEDE',
        },
      },
    },
  },
}
