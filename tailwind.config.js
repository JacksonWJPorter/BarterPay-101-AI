/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./frontend/index.html'],
  theme: {
    extend: {
      colors: {
          'bg-hotpink': '#f2228e',
        },
      },
    },
  plugins: [],
  safelist: [{
    pattern: /(bg|text|border)-s2cond(Purple|Pink|Orange|Yellow|Lime|Mint|Test|Test2)/
}]
}
  
