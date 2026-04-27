import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0e27',
        'secondary-bg': '#1a1f3a',
        'accent-blue': '#00d4ff',
        'accent-blue2': '#0066ff',
        'text-primary': '#ffffff',
        'text-secondary': '#a0aec0',
        'card-bg': '#151a30',
        border: '#2d3748',
      },
    },
  },
  plugins: [],
}

export default config
