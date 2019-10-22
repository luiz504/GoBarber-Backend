module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'prettier'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins:['prettier'],
  rules: {
    'prettier/prettier' : 'error',
    'class-methos-use-this': 'off',
    'class-methods-use-this': 'off'

  },
};
