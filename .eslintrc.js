module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json']
  },
  plugins: ['@typescript-eslint'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    'max-len': ['error', { code: 140, ignorePattern: '^import [^,]+ from |^export | implements ' }],
    '@typescript-eslint/member-ordering': [
      'error',
      { default: ['static-field', 'instance-field', 'static-method', 'instance-method'] }
    ],
    'no-empty': ['error'],
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'sort-keys': 'off',
    quotes: ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
    semi: ['error', 'always'],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        asyncArrow: 'always',
        named: 'never'
      }
    ],
    '@typescript-eslint/typedef': [
      'error',
      {
        'call-signature': true,
        'arrow-call-signature': true,
        parameter: true,
        'arrow-parameter': true,
        'property-declaration': true,
        'variable-declaration': true,
        'member-variable-declaration': true,
        'object-destructuring': true,
        'array-destructuring': true
      }
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['camelCase'],
        leadingUnderscore: 'require'
      },
      {
        selector: ['variableLike', 'classProperty'],
        types: ['boolean'],
        modifiers: ['public', 'readonly', 'static', 'abstract'],
        format: ['PascalCase', 'camelCase'],
        prefix: ['is', 'should', 'has', 'can', 'did', 'will']
      },
      {
        selector: 'classProperty',
        modifiers: ['private'],
        types: ['boolean'],
        format: ['camelCase', 'PascalCase'],
        leadingUnderscore: 'require',
        prefix: ['is', 'should', 'has', 'can', 'did', 'will']
      },
      {
        selector: 'classProperty',
        modifiers: ['private'],
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'require'
      },
      {
        selector: 'classProperty',
        modifiers: ['readonly'],
        format: ['PascalCase', 'UPPER_CASE']
      },
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: true
        }
      },
      {
        selector: ['variable', 'function'],
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        leadingUnderscore: 'allow'
      }
    ],
    'comma-dangle': ['error', 'never']
  }
};
