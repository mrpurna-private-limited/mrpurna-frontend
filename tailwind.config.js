/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mrpurna: {
          green: '#059669',
          dark: '#064e3b',
          accent: '#f59e0b',
          bg: '#f0fdf4'
        }
      }
    },
  },
  plugins: [],
}
