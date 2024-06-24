/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      screens: {
        'xss': '220px', 
        'xs': '480px',
        '3xl': '1920px',
      },
      fontFamily: {
        pop: ["Poppins", "sans-serif"]
      }
    },
  },
  plugins: [],
}

