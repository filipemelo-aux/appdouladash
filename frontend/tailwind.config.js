/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#f6efec",
          100: "#ead8d1",
          200: "#d7b5a8",
          300: "#c29180",
          400: "#a86e5c",
          500: "#7a4a3b", // COR BASE
          600: "#6a3f32",
          700: "#5a3429",
          800: "#4a2a21",
          900: "#3a2119",
        },
      },
    },
  },
  plugins: [],
}
