module.exports = {
  purge: {
    content: ["./src/**/*.{html,ts}"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    textSizes: {
      // Defined in styles.scss
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      bold: 700,
    },
    colors: {
      grey: {
        '05': 'var(--grey-05)',
        10: 'var(--grey-10)',
        20: 'var(--grey-20)',
        30: 'var(--grey-30)',
        40: 'var(--grey-40)',
        50: 'var(--grey-50)',
        60: 'var(--grey-60)',
        70: 'var(--grey-70)',
        80: 'var(--grey-80)',
        90: 'var(--grey-90)',
      },
      primary: {
        '05': 'var(--primary-05)',
        10: 'var(--primary-10)',
        20: 'var(--primary-20)',
        30: 'var(--primary-30)',
        40: 'var(--primary-40)',
        50: 'var(--primary-50)',
        60: 'var(--primary-60)',
        70: 'var(--primary-70)',
        80: 'var(--primary-80)',
        90: 'var(--primary-90)',
      },
    },
    extend: {
      fontFamily: {
        'serif': ['Merriweather'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
