/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sage: {
          50:  '#f0f5f1',
          100: '#daeade',
          200: '#b5d5bc',
          300: '#8ab89a',
          400: '#6B8F71',
          500: '#5a7a5f',
          600: '#4a654e',
          700: '#3a503d',
          800: '#2a3b2c',
          900: '#1a261c',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundColor: {
        app: '#FAFAFA',
      },
    },
  },
  plugins: [],
}
