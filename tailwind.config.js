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
        'gemini-bg': '#131314',
        'gemini-card': '#1e1f20',
        'gemini-sidebar': '#1e1f20',
        'gemini-input': '#1e1f20',
        'gemini-text-primary': '#e3e3e3',
        'gemini-text-secondary': '#9aa0a6',
        'gemini-accent': '#8ab4f8',
        'gemini-user-bg': '#1e1f20',
        'gemini-model-bg': '#131314',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
