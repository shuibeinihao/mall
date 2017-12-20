let rollup = require('rollup');
let babel = require('rollup-plugin-babel');
let json = require('rollup-plugin-json');
let nodeResolve = require('rollup-plugin-node-resolve');
let commonjs = require('rollup-plugin-commonjs');
let SOURCEMAPPING_URL = require('./sourceMappingURL');

module.exports = function (file, res, next) {
  rollup.rollup({
    entry: file,
    external: ['jquery', 'modernizr', 'text', 'angular', 'lazyload', 'swiper', 'vue', 'bootstrap/scrollspy', 'jsonlylightbox'],
    globals: {
      angular: 'angular',
      vue: 'vue'
    },
    plugins: [
      nodeResolve({ jsnext: true, main: true }),
      commonjs(),
      json(),
      babel({
        exclude: 'node_modules/**',
        runtimeHelpers: true
      })
    ]
  }).then(function (bundle) {
    let { code, map } = bundle.generate({
      format: 'amd',
      sourceMap: true
    });

    let url = map.toUrl();
    code += `//# ${SOURCEMAPPING_URL}=${url}\n`;
    res
      .type('application/javascript')
      .send(code);
  }, next);
};
