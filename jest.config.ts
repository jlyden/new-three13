import type { InitialOptionsTsJest } from 'ts-jest';

const config: InitialOptionsTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    './dist/test/'
  ],
  globals: {
    'ts-jest': {}
  }
}

export default config;