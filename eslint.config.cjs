// eslint.config.mjs
import prettierPlugin from 'eslint-plugin-prettier';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.{js,ts}'],
    ignores: [
      '.git/**',
      '.idea/**',
      '.vscode/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      'lib/**',
      '**/*.min.js',
      '**/*.spec.js',
      'uploads/**',
    ],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
    plugins: {
      prettier: prettierPlugin,
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      semi: ['error', 'always'], // 'true' o‘rniga ['error', 'always']
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'prettier/prettier': 'error',
    },
  },
];