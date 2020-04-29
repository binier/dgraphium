const base = require('./jest.project')({ dirname: __dirname });

module.exports = {
  ...base,
  projects:
  [
      "<rootDir>/packages/*/jest.config.js"
  ],
  coverageDirectory: "<rootDir>/coverage/"
};
