import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    transform: {
        '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.json' }],
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.ts',
        '\\.(css|scss)$': 'identity-obj-proxy',
    },
    testMatch: [
        '**/tests/**/*.(spec|test).[jt]s?(x)',
    ],
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        'tests/**/*.{ts,tsx}',
        '__mocks__/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/index.ts',
        '!src/setupTests.ts',
        '!src/main.tsx',
    ],
    coverageReporters: ['text', 'lcov']
};

export default config;
