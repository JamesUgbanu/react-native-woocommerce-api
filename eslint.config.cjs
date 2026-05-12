module.exports = [
  {
    files: ['**/*.js'],
    ignores: ['node_modules/**'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'script',
      globals: {
        module: 'readonly',
        require: 'readonly',
        console: 'readonly',
        describe: 'readonly',
        it: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['error', { args: 'none' }],
    },
  },
  {
    files: ['example.js'],
    languageOptions: {
      sourceType: 'module',
    },
  },
];
