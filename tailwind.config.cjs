/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        'gray-900': '#1a1a1a',
        'gray-800': '#2c2c2c',
        'gray-700': '#3d3d3d',
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