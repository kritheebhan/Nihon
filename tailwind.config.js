/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        n5: '#2563eb',
        'n5-light': '#eff6ff',
        'n5-border': '#bfdbfe',
        n4: '#7c3aed',
        'n4-light': '#f5f3ff',
        'n4-border': '#ddd6fe',
        hbg: '#0f172a',
        surface: '#ffffff',
        'page-bg': '#f1f5f9',
      },
      fontFamily: {
        sans: ['"Inter"', '"Segoe UI"', 'system-ui', 'sans-serif'],
        jp: ['"Noto Sans JP"', '"Hiragino Sans"', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
    },
  },
  plugins: [],
}
