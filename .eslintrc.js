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
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/html-self-closing': 0,
    "comma-dangle": ["error", "never"],
    "linebreak-style": "off",
    '@typescript-eslint/no-unused-vars': 'error'
  },
  globals: {
    'jest/globals': true,
    jasmine: true
  }
}