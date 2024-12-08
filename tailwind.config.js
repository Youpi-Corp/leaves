/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'grid-pattern': `
          linear-gradient(to right, #f0f0f0 1px, transparent 1px),
          linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        'grid-size': '20px 20px',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        bfgreen: {
          base: '#5FBB63',
          'base-light': '#6fc973',
          dark: '#388E3C',
          light: '#C8E6C9',
          white: '#F2FFF3',
          darker: '#285C2B',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            h1: {
              fontSize: '55px',
              color: 'theme(colors.bfgreen.darker)',
              fontFamily: 'theme(fontFamily.montserrat)',
              fontWeight: 'bold',
            },
          },
        },
      },
    },
  }
}
