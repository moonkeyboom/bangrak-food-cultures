/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tan: '#D8BA98',
        maroon: '#7F0303',
        alabaster: '#EFE8DF',
        'light-blue': '#96C0CE',
        'midnight-blue': '#0F414A',
      },
    },
  },
  plugins: [],
}
