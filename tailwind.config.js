module.exports = {
  purge: process.env.NODE_ENV === 'production' ? ['./index.html', './src/**/*.{vue,ts}'] : false,
  darkMode: false,
  theme: {
    fontFamily: {
      sans: ['Lexend']
    },
    extend: {
      spacing: {
        120: '40rem'
      }
    }
  },
  variants: {
    extend: {}
  }
};
