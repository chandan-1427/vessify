/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/default-esm', // Use the ESM-specific preset
  testEnvironment: 'node',
  injectGlobals: true,
  transform: {
    // Use ts-jest for all ts/tsx files
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],
  moduleNameMapper: {
    // Crucial for your custom Prisma path
    '^../generated/prisma/client$': '<rootDir>/generated/prisma/index.js',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  extensionsToTreatAsEsm: ['.ts'],
};