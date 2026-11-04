/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070E1C',
          900: '#0B1426',
          850: '#0F1A30',
          800: '#131F38',
          700: '#1B2A4A',
          600: '#26385E',
        },
        brand: {
          green: '#22C55E',
          greenDark: '#16A34A',
          blue: '#3B82F6',
          amber: '#F59E0B',
          red: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(34,197,94,0.35)',
      },
    },
  },
  plugins: [],
}
