/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,vue}",
    "./pages/**/*.{js,ts,vue}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        dnd: {
          dark: '#1a1510',
          leather: '#3c2a21',
          red: '#7c1f1f',
          gold: '#cfb673',
          'gold-dim': '#8a7346',
          parchment: '#f2e8c9',
          'parchment-dark': '#dcd0a8',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'serif'],
        sans: ['Lora', 'sans-serif'],
      },
    },
  },
  plugins: [],
}