/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
       fontFamily: {
        sans: ['Poppins', 'sans-serif'], // ✅ maps to 'font-sans'
        poppins: ['Poppins', 'sans-serif'], // ✅ this maps to 'font-poppins'
      },
    },
  },
   plugins: [scrollbar],
}