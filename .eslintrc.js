module.exports = {
  root: true,
  ignorePatterns: ['dist/*', '/**/*.js'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    project: ['tsconfig.json'],
    createDefaultProgram: true
  },
  extends: ['plugin:prettier/recommended'],
  rules: {
    'max-len': ['error', { code: 140, ignorePattern: '^import [^,]+ from |^export | implements ' }],
    '@typescript-eslint/array-type': ['error'],
    '@typescript-eslint/ban-types': 'error',
    '@typescript-eslint/default-param-last': ['error'],
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/no-duplicate-enum-values': 'warn',
    '@typescript-eslint/switch-exhaustiveness-check': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': ['error', { allowArgumentsExplicitlyTypedAsAny: true }],
    '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
    '@typescript-eslint/member-ordering': [
      'error',
      {
        default: [
          'signature',

          'public-static-field',
          'protected-static-field',
          'private-static-field',
          'public-decorated-field',
          'protected-decorated-field',
          'private-decorated-field',
          'public-instance-field',
          'protected-instance-field',
          'private-instance-field',
          'public-abstract-field',
          'protected-abstract-field',
          'private-abstract-field',

          ['public-static-get', 'public-static-set'],
          ['protected-static-get', 'protected-static-set'],
          ['private-static-get', 'private-static-set'],
          ['public-decorated-get', 'public-decorated-set'],
          ['protected-decorated-get', 'protected-decorated-set'],
          ['private-decorated-get', 'private-decorated-set'],
          ['public-instance-get', 'public-instance-set'],
          ['protected-instance-get', 'protected-instance-set'],
          ['private-instance-get', 'private-instance-set'],
          ['public-abstract-get', 'public-abstract-set'],
          ['protected-abstract-get', 'protected-abstract-set'],
          ['private-abstract-get', 'private-abstract-set'],

          'constructor',

          'public-static-method',
          'protected-static-method',
          'private-static-method',
          'public-decorated-method',
          'protected-decorated-method',
          'private-decorated-method',
          'public-instance-method',
          'protected-instance-method',
          'private-instance-method',
          'public-abstract-method',
          'protected-abstract-method',
          'private-abstract-method'
        ]
      }
    ],
    'no-empty': ['error'],
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/prefer-return-this-type': 'error',
    '@typescript-eslint/prefer-string-starts-ends-with': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
    'sort-keys': 'off',
    quotes: ['error', 'single', { allowTemplateLiterals: true, avoidEscape: true }],
    semi: ['error', 'always'],
    'space-before-function-paren': ['error', { anonymous: 'never', asyncArrow: 'always', named: 'never' }],
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
        allowDirectConstAssertionInArrowFunctions: true,
        allowConciseArrowFunctionExpressionsStartingWithVoid: true
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
        selector: 'class',
        modifiers: ['abstract'],
        format: ['PascalCase'],
        prefix: ['Abstract']
      },
      {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['PascalCase', 'camelCase'],
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
