/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        'pink-glow': '0 0 15px #ff66aa',
      },
      transform: {
        'scale-110': 'scale(1.1)',
      },
    }
  },
  plugins: [],
}