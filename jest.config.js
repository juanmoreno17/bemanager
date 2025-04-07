module.exports = {
    preset: 'react-native',
    setupFilesAfterEnv: ['@testing-library/jest-native/legacy-extend-expect'],
    transformIgnorePatterns: [
        'node_modules/(?!(jest-)?react-native|react|@react-native|@react-native-firebase|@testing-library)',
    ],
    testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
};
