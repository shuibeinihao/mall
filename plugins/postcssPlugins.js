let cssnano = require('cssnano');
let cssnext = require('postcss-cssnext');
let assets = require('postcss-assets');
let atImport = require('postcss-import');

const assetsOption = {};

module.exports = [
  {
    module: atImport,
    options: {
      plugins: [assets(assetsOption)]
    }
  },
  {
    module: assets,
    options: assetsOption
  },
  {
    module: cssnext,
    options: {
      browsers: ['> 1%', 'last 2 versions', 'Firefox >= 20', 'Opera 12.1', 'IE >= 8']
    }
  },
  {
    module: cssnano,
    options: {
      autoprefixer: false,
      zindex: false
    }
  }
];
