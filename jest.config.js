module.exports = {
    preset: 'react-native',
    setupFilesAfterEnv: ['@testing-library/jest-native/legacy-extend-expect', './jest.setup.js'],
    transformIgnorePatterns: [
        'node_modules/(?!(jest-)?react-native|react|@react-native|@react-native-firebase|@testing-library|crypto-es)',
    ],
    testPathIgnorePatterns: [
        '/node_modules/',
        '/android/',
        '/ios/',
        '/__tests__/utils/renderWithProviders',
    ],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
};
