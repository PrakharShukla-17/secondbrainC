/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brain: {
          50:  '#f0f0ff',
          100: '#e4e4ff',
          200: '#cdceff',
          300: '#ababff',
          400: '#807aff',
          500: '#6355ff',
          600: '#5033f7',
          700: '#4322e3',
          800: '#381db8',
          900: '#2f1b91',
          950: '#1a0c5c',
        },
        surface: '#f4f4f8',
        card: '#ffffff',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
