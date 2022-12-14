/* eslint-disable no-undef */
module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaFeatures: {
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  env: {
    jest: true,
    node: true,
    browser: true
  },
  globals: {
    page: true,
    browser: true,
    context: true,
    jestPuppeteer: true,
    __dirname: true,
    module: true
  },
}
