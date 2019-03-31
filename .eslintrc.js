module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'jest',
    'plugin:nuxt/recommended'
  ],
  // add your custom rules here
  rules: {
  },
  globals: {
    'jest/globals': true,
    jasmine: true
  }
}
