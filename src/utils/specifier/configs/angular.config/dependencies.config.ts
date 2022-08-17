export function devDependencies(skipGit: boolean = false): string[] {
  const devDependencies = [
    '@types/lodash.get',
    '@types/lodash.set',
    '@types/lodash.transform',
    '@types/lodash.isequal',

    'eslint-plugin-prettier',
    'eslint-config-prettier',

    'npm-run-all',

    'prettier',

    'postcss',
    'postcss-scss',

    'stylelint',
    'stylelint-config-standard',
    'stylelint-declaration-strict-value',
    'stylelint-no-unsupported-browser-features',
    'stylelint-scss',

    'tslint-config-prettier'
  ];

  if (!skipGit) {
    devDependencies.push('pretty-quick', 'husky');
  }

  return devDependencies;
}

export const dependencies: string[] = [
  'lodash.get',
  'lodash.set',
  'lodash.transform',
  'lodash.isequal',

  '@ngx-translate/core',
  '@ngx-translate/http-loader',
  'ngx-pagination',
  'ngx-toastr',
  'ngx-infinite-scroll',

  'class-transformer',

  'reset-css'
];
