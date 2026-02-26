// @ts-check

/** @type {import('@commitlint/types').UserConfig} */
const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      ['app', 'components', 'layouts', 'hooks', 'lib', 'styles', 'services', 'middleware', 'config', 'contexts', 'types', 'modules'],
    ],
    'scope-empty': [1, 'never'],
  },
};

export default config;
