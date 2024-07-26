/** @type {import('tailwindcss').Config} */
export default {
  content:  [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {  colors: {
      'custom-background': '#989898',
    },
    backgroundImage: {
      'custom-linear': "linear-gradient(to bottom, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.15) 100%)",
      'custom-radial': "radial-gradient(at top center, rgba(255,255,255,0.40) 0%, rgba(0,0,0,0.40) 120%)",
    },
    backgroundBlendMode: {
      'multiply': 'multiply',
    },
  },
  },
  plugins: [],
}

