module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true  
  },
  extends: [
    'eslint:recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    // TypeScript specific rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-var-requires': 'error',
    
    // Regular ESLint rules (not TypeScript prefixed)
    'prefer-const': 'error',
    'no-var': 'error',
    'no-console': 'off'
  },
  ignorePatterns: [
    'dist/',
    'node_modules/'
  ]
};