//参考: https://raw.githubusercontent.com/rollup/rollup/master/src/utils/sourceMappingURL.js

// this looks ridiculous, but it prevents sourcemap tooling from mistaking
// this for an actual sourceMappingURL
let SOURCEMAPPING_URL = 'sourceMa';
SOURCEMAPPING_URL += 'ppingURL';

module.exports = SOURCEMAPPING_URL;
