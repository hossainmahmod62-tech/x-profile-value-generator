/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core palette — deep indigo-black base with soft blue/violet highlights
        void: {
          DEFAULT: '#0A0E1B',
          light: '#11162B',
        },
        nebula: {
          DEFAULT: '#171432',
          light: '#221D47',
        },
        signal: {
          blue: '#5B8DEF',
          violet: '#9D6FFF',
          cyan: '#6EE7F5',
        },
        mist: '#EDEFF8',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'aurora': 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(93,120,255,0.25), transparent), radial-gradient(ellipse 60% 40% at 85% 20%, rgba(157,111,255,0.18), transparent), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(110,231,245,0.10), transparent)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0,0,0,0.35)',
        'glow-blue': '0 0 40px rgba(91,141,239,0.35)',
        'glow-violet': '0 0 40px rgba(157,111,255,0.35)',
      },
      borderRadius: {
        'xl2': '1.25rem',
        'xl3': '1.75rem',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.9)', opacity: '0.6' },
          '70%': { transform: 'scale(1.4)', opacity: '0' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.2s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
}
