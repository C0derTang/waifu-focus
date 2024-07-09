/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        'neon-green': '#39ff14',
        'neon-pink': '#ff6ec7',
      },
      transform: {
        'scale-110': 'scale(1.1)',
      },
    }
  },
  plugins: [],
}