/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'pastel-pink': '#FFB3D9',
        'pastel-purple': '#D4BBFF',
        'pastel-blue': '#A8D8FF',
        'pastel-peach': '#FFD4B3',
        'pastel-mint': '#B3F5E0',
        'pastel-light-pink': '#FFD4E5',
        'pastel-lavender': '#D4C5FF',
        'pastel-sky': '#C5E5FF',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delay-1': 'float 7s ease-in-out infinite 1s',
        'float-delay-2': 'float 8s ease-in-out infinite 2s',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-20px) translateX(10px)' },
        },
      },
    },
  },
  plugins: [],
}
