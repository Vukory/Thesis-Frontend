import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    plugins: {
      'import': importPlugin,
    }
  },
  {
    ignores: [
      '_site',
      'node_modules/**',
      'src/lib/**',
    ],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.nodeBuiltin,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.mjs'],
    rules: {
      curly: 'error',
      quotes: ['error', 'single'],
      'no-unused-vars': ['error', {
        'argsIgnorePattern': '^_'
      }],
      'one-var': ['error', 'never'],
      strict: 'error',
      // eslint-plugin-import
      'import/enforce-node-protocol-usage': ['error', 'always'],
      'import/extensions': ['error', 'always'],
      'import/no-cycle': 'error',
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
          },
        },
      ],
    },
  },
];
