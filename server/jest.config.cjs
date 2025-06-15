module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(test|spec).(ts|js)',
    '<rootDir>/src/**/*.(test|spec).(ts|js)'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.(ts|js)',
    '!src/**/*.d.ts',
    '!src/server.ts',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
};