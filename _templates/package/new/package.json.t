---
to: packages/<%= name %>/package.json
---
<%- JSON.stringify({
  "name": baseName ? baseName + '/' + name : name,
  "license": license,
  "version": "0.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "dist/*"
  ],
  "author": author,
  "repository": {
    ...repository,
    directory: 'packages/' + name
  },
  "publishConfig": {
    "access": publishAccess
  },
  "scripts": {
    "clean:dist": "rimraf dist",
    "compile": "tsc -b tsconfig.build.json",
    "build": "yarn clean:dist && yarn compile",
    "test": "jest --coverage",
    "test:watch": "jest --coverage --watch",
    "test:prod": "yarn test -- --no-cache",
    "report-coverage": "cat ./coverage/lcov.info | coveralls",

    "prepublishOnly": "yarn build"
  },
  "devDependencies": h.obj.onlyKeys([
    '@types/jest',
    '@types/node',
    'coveralls',
    'jest',
    'rimraf',
    'ts-jest',
    'ts-node',
    'typescript'
  ], devDependencies),
}, 0, 2) %>
