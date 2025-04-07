module.exports = {
    extends: ['prettier'],
    plugins: ['prettier', 'jest', 'react-native'],
    rules: {
        'prettier/prettier': 'warn',
    },
    env: {
        'jest/globals': true,
        es6: true,
    },
    parser: '@babel/eslint-parser',
    parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2018,
    },
};
