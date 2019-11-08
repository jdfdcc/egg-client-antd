module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
  },
  rules: {
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': 0,
    'import/newline-after-import': 0,
    'react/no-array-index-key': 0,
    'max-len': 0,
    'no-unused-expressions': 0,
    'no-restricted-syntax': 0,
    'no-param-reassign': 0,
    'prefer-promise-reject-errors': 0,
    'guard-for-in': 0,
  },
};
