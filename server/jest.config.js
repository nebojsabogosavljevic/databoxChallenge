module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testEnvironment: 'node',
    testMatch: ['**/*.test.ts'],
    collectCoverageFrom: ['src/**/*.ts'],
    coverageReporters: ['lcov', 'text-summary'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};