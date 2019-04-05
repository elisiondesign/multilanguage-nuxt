module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  plugins: ['@typescript-eslint'],
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  extends: [
    '@nuxtjs'
  ],
  // add your custom rules here
  rules: {
  },
  globals: {
    'jest/globals': true,
    jasmine: true
  }
}
