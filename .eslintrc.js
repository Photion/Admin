module.exports = {
  root: true,
  env: {
    node: true,
  },
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-unused-vars': [2, {'args': 'after-used', 'argsIgnorePattern': '^_'}],
    'comma-dangle': ['error', 'always-multiline'],
    'indent': ['error', 2],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-multiple-empty-lines': ['error', { 'max': 2 }],
    'no-unused-vars': [2, {'args': 'after-used', 'argsIgnorePattern': '^_'}],
    'no-useless-constructor': 'off',
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'space-before-function-paren': 'off',
    'vue/html-indent': ['error', 2],
    'vue/max-attributes-per-line': ['error', { singleline: 4 }],
    'vue/no-mutating-props': 'off',
    'object-curly-spacing': ['error', 'always'],
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
