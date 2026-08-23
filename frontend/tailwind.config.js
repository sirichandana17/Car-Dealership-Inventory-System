/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      colors: {
        brand: {
          50:  '#fff1f2',
          100: '#ffe4e6',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          900: '#881337',
        },
      },
      backgroundImage: {
        'carbon': "repeating-linear-gradient(45deg, #1a1a1a 0px, #1a1a1a 2px, #111 2px, #111 4px)",
      },
    },
  },
  plugins: [],
};
