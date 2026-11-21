import js from '@eslint/js'
import globals from 'globals'

export default [
  // the frontend has its own eslint config and is linted from frontend/
  { ignores: ['frontend/**', 'dist/**'] },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: globals.node,
    },
    rules: js.configs.recommended.rules,
  },
]
