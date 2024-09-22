import js from '@eslint/js';
import globals from 'globals';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
  },
  {
    ignores: ['node_modules', 'eslint.config.js'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
  },
  {
    files: ['**/*.{js}'],
    rules: {
      ...eslintConfigPrettier,
    },
  },
];
