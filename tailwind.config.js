/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        wire: {
          brown: '#8B4513',
          blue: '#1E40AF',
          greenYellow: '#16A34A',
          grey: '#6B7280',
          black: '#111827',
          red: '#DC2626',
          white: '#F9FAFB',
        },
      },
    },
  },
  plugins: [],
};