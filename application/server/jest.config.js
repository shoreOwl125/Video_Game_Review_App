module.exports = {
  preset: 'ts-jest', // Use ts-jest preset to handle TypeScript
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest', // Transform TypeScript files using ts-jest
  },
  moduleFileExtensions: ['ts', 'js'], // Recognize these file extensions
  testMatch: ['**/tests/**/*.test.ts'], // Find test files in the "tests" folder
  testTimeout: 25000, // 10 seconds timeout for all tests
}
