---
to: packages/<%= name %>/jest.config.js
---
module.exports = require('../../jest.project')({ dirname: __dirname });
