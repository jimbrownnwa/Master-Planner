/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm neutrals
        cream: {
          50: '#FCFBF8',
          100: '#FAF8F3',
          200: '#F5F2EA',
          300: '#EBE6DA',
        },
        warm: {
          50: '#F9F8F6',
          100: '#F3F1ED',
          200: '#E8E4DD',
          300: '#D4CFC4',
          400: '#A39D91',
          500: '#6B6560',
          600: '#4A4540',
          700: '#2C2825',
          800: '#1A1816',
          900: '#0F0E0D',
        },
        // Accent colors
        sienna: {
          50: '#FDF5F3',
          100: '#FAEAE5',
          200: '#F4D0C4',
          300: '#EDB5A3',
          400: '#E18865',
          500: '#C97755',
          600: '#B35D3E',
          700: '#8B4830',
          800: '#5C3020',
          900: '#2D1810',
        },
        amber: {
          50: '#FDF8F0',
          100: '#FAEFE0',
          200: '#F5DEC2',
          300: '#EACCA3',
          400: '#D4A574',
          500: '#C9A36D',
          600: '#A88554',
          700: '#7D6340',
          800: '#52412A',
          900: '#292015',
        },
        // Project accent colors (muted, sophisticated)
        sage: {
          DEFAULT: '#7C9885',
          light: '#A4BAAC',
          dark: '#5A7361',
        },
        slate: {
          DEFAULT: '#6B7B8C',
          light: '#8FA1B3',
          dark: '#4A5666',
        },
        rust: {
          DEFAULT: '#A8654F',
          light: '#C98A75',
          dark: '#7D4838',
        },
        plum: {
          DEFAULT: '#8B6F8F',
          light: '#B09AB3',
          dark: '#67526A',
        },
        teal: {
          DEFAULT: '#5C8A8A',
          light: '#7EADAD',
          dark: '#426666',
        },
      },
      fontFamily: {
        serif: ['Crimson Pro', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h1': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h2': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'h3': ['1.5rem', { lineHeight: '1.4' }],
        'h4': ['1.25rem', { lineHeight: '1.5' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'small': ['0.875rem', { lineHeight: '1.5' }],
        'tiny': ['0.75rem', { lineHeight: '1.4' }],
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(44, 40, 37, 0.04), 0 1px 2px rgba(44, 40, 37, 0.06)',
        'soft-lg': '0 8px 24px rgba(44, 40, 37, 0.06), 0 2px 6px rgba(44, 40, 37, 0.04)',
        'soft-xl': '0 16px 48px rgba(44, 40, 37, 0.08), 0 4px 12px rgba(44, 40, 37, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in': 'slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
