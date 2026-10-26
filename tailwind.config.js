/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          400: '#0EA5E9', // Vibrant Sky Blue
          500: '#3b82f6',
          600: '#2563EB', // Modern Royal Blue
          900: '#1E3A8A', // Deep Navy
        },
        surface: {
          main: '#ffffff', // Pure white background
          muted: '#f8fafc', // Slightly off-white for cards/sections
          border: '#e2e8f0', // Clean, subtle dividers
        },
        text: {
          primary: '#0f172a', // Crisp, dark slate for high contrast readability
          secondary: '#64748b', // Softer gray for subtext and labels
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        // Updated shadows to be much lighter and softer for a white background
        'soft': '0 4px 15px -3px rgba(0, 0, 0, 0.05)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}