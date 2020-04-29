const path = require('path');
const { pathsToModuleNameMapper } = require('ts-jest/utils');

const ROOT_DIR = __dirname;
const TSCONFIG = path.resolve(ROOT_DIR, 'tsconfig.json');
const tsconfig = require(TSCONFIG);

module.exports = ({ dirname }) => {
  const pkg = require(path.resolve(dirname, 'package.json'));
  const isRoot = ROOT_DIR === dirname;
  const nameKeys = !isRoot ? {} : {
    name: pkg.name,
    displayName: pkg.name
  };

  return {
    ...nameKeys,
    rootDir: dirname,
    cacheDirectory: path.resolve(ROOT_DIR, 'node_modules/.cache/jest'),
    transform: { '^.+\\.tsx?$': 'ts-jest' },
    moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, { prefix: `${ROOT_DIR}/` }),
    modulePathIgnorePatterns: ['dist'],
    collectCoverage: true,
    restoreMocks: true,
  };
};
