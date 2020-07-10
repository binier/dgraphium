const pkg = require('./package.json');

const flatten = arr => [].concat.apply([], arr);

const onlyKeys = (keys, obj) => flatten(keys)
  .reduce((r, k) => { r[k] = obj[k]; return r; }, {});

const omitKeys = (keys, obj) => {
  const filteredKeys = Object.keys(obj)
    .filter(k => keys.includes(k));
  return onlyKeys(filteredKeys, obj);
};

module.exports = {
  localsDefaults: {
    baseName: '@' + pkg.name,
    author: pkg.author,
    license: pkg.license,
    publishAccess: 'public',
    repository: pkg.repository,
    devDependencies: pkg.devDependencies,
  },
  helpers: {
    obj: {
      onlyKeys,
      omitKeys,
    },
  },
};
