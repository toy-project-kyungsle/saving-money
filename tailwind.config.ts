import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.vue'],
  theme: {
    extend: {
      colors: {
        salary: {
          DEFAULT: '#4CAF50',
          light: '#81C784',
          dark: '#388E3C',
        },
        savings: {
          DEFAULT: '#2196F3',
          light: '#64B5F6',
          dark: '#1976D2',
        },
        stock: {
          DEFAULT: '#FF9800',
          light: '#FFB74D',
          dark: '#F57C00',
        },
        crypto: {
          DEFAULT: '#9C27B0',
          light: '#BA68C8',
          dark: '#7B1FA2',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
