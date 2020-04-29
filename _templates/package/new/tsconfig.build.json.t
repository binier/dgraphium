---
to: packages/<%= name %>/tsconfig.build.json
---
{
  "extends": "../../tsconfig.build.json",

  "compilerOptions": {
    "outDir": "./dist"
  },

  "include": [
    "src/**/*"
  ]
}