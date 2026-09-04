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
        cyber: {
          950: '#060a12',
          900: '#0b1220',
          850: '#0f172a',
          800: '#152238',
          700: '#1e293b',
          600: '#334155',
          border: '#1e3a5f',
          accent: '#00f2fe',
          cyan: '#38bdf8',
          blue: '#2563eb',
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b',
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(56, 189, 248, 0.25)',
        'glow-rose': '0 0 25px rgba(244, 63, 94, 0.35)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.25)',
        'glow-blue': '0 0 20px rgba(37, 99, 235, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 4s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        }
      }
    },
  },
  plugins: [],
}
