import type { Config } from 'jest';
/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

const configs: Config = {
  testTimeout: 30000,
  preset: 'jest-puppeteer',
  cache: false,
  testMatch: ['**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  // testEnvironment: 'node',
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  clearMocks: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  globalSetup: './setup.cjs',
  globalTeardown: './teardown.cjs',
  testEnvironment: './puppeteer_environment.cjs',
};

export default configs;
