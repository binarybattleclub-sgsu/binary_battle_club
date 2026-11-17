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
        midnight: '#080D18',
        navy: {
          950: '#080D18', // Midnight Black
          900: '#101D35', // Deep Navy
          850: '#13223d',
          800: '#172945', // Hover surfaces
          750: '#1e3352',
          700: '#243650', // Subtle borders
          600: '#2d4466',
        },
        electric: {
          500: '#2563EB', // Electric Blue (Primary CTA)
          600: '#1D4ED8', // Secondary Blue
          700: '#1e40af',
          glow: 'rgba(37, 99, 235, 0.35)',
        },
        cyan: {
          300: '#7dd3fc',
          400: '#38BDF8', // Cyber Cyan (Secondary highlight)
          500: '#0ea5e9',
          glow: 'rgba(56, 189, 248, 0.25)',
        },
        cool: {
          white: '#DCE6F5', // Cool White (Primary typography)
          muted: '#9FB0C8', // Muted text
          subtle: '#62799c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'electric-sm': '0 2px 10px rgba(37, 99, 235, 0.2)',
        'electric': '0 4px 20px rgba(37, 99, 235, 0.25)',
        'electric-lg': '0 8px 30px rgba(37, 99, 235, 0.35)',
        'cyan-sm': '0 2px 10px rgba(56, 189, 248, 0.2)',
        'cyan-glow': '0 0 25px rgba(56, 189, 248, 0.25)',
        'card-subtle': '0 10px 30px -10px rgba(8, 13, 24, 0.8)',
      },
      animation: {
        'marquee': 'marquee 35s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
