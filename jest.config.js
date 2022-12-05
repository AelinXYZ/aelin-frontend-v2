/* eslint-disable @typescript-eslint/no-var-requires */

const { pathsToModuleNameMapper } = require('ts-jest')

const { compilerOptions } = require('./tsconfig.json')

module.exports = {
  // Use the TypeScript compiler to transpile TypeScript code
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },

  // Specify the file patterns for test files
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',

  // Specify the file patterns for code files
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Ignore folders
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/.github/', '/.husky/'],

  // Config re-map imports
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
}
