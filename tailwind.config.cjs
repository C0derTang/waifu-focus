/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        'neon-green': '#39ff14',
        'neon-pink': '#ff6ec7',
        'warm-cream': '#FFF8ED',
        'warm-orange': '#F6A35B',
        'burnt-orange': '#F57C00',
        'deep-salmon': '#FF8C69',
        'pastel-blue': '#A7C7E7',
        'pastel-green': '#B5D6B2',
        'pastel-purple': '#D7BDE2',
        'pastel-yellow': '#FFF1B5',
        'pastel-pink': '#FFD1DC',
      },
      transform: {
        'scale-110': 'scale(1.1)',
      },
    }
  },
  plugins: [],
}