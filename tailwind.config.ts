import type { Config } from 'tailwindcss';
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: '#faf6ef',
        ivory: '#fffaf1',
        porcelain: '#ffffff',
        petal: '#f3e6e3',
        mist: '#edf0e7',
        rose: '#b98487',
        mauve: '#85565f',
        sage: '#8b947c',
        champagne: '#b4945e',
        ink: '#372f2a',
        forest: '#354438',
        wine: '#683d49',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        'serif-e': ['var(--font-display)', 'Georgia', 'serif'],
        script: ['var(--font-script)', 'cursive'],
      },
    },
  },
} satisfies Config;
