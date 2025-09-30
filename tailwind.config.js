/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'veebimajutus-orange': '#FF6B35',
        'veebimajutus-coral': '#FF8C61',
        'veebimajutus-darkorange': '#E85A28',
      },
    },
  },
  plugins: [],
}
