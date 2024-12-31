/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      pixel: ["'Press Start 2P'", 'cursive'],
      sans: ['Poppins', 'sans-serif'],
    },
  },
  plugins: [],
}