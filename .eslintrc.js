const path = require('path');

module.exports = {
  root: true,
  extends: ['@react-native', 'plugin:@typescript-eslint/strict-type-checked', 'plugin:@typescript-eslint/stylistic-type-checked'],
  plugins: ['eslint-plugin-react-compiler'],
  rules: {
    'react/no-array-index-key': 'error',
    'react/prefer-read-only-props': 'error',
    'react/jsx-no-useless-fragment': 'error',
    '@typescript-eslint/prefer-readonly': 'error',
    'react-compiler/react-compiler': 'error',
    'react/jsx-no-literals': 'error',
    'react/jsx-no-constructed-context-values': 'error',
    'no-console': 'warn',

    curly: 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-void': 'off',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: { project: path.join(__dirname, 'tsconfig.json') },
};
