import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testMatch: ['**/test/**/*.spec.ts'],
  collectCoverage: true,
  coverageDirectory: './coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts',
    '!src/**/*.module.ts',
    '!src/**/*.interface.ts',
  ],
  coverageReporters: ['text', 'lcov'],
};

export default config;
