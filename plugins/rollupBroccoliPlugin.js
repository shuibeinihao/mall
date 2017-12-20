var Filter = require('broccoli-persistent-filter');
let rollup = require('rollup');
let babel = require('rollup-plugin-babel');
let uglify = require('rollup-plugin-uglify');
let json = require('rollup-plugin-json');
let nodeResolve = require('rollup-plugin-node-resolve');
let commonjs = require('rollup-plugin-commonjs');
let path = require('path');

function Rollup(inputTree, _options) {
  if (!(this instanceof Rollup)) {
    return new Rollup(inputTree, _options);
  }

  var options = _options || {};
  delete options.persist;
  Filter.call(this, inputTree, options);

  this.options = options;
  this.extensions = this.options.filterExtensions || ['js'];
  this.name = 'broccoli-rollup';
}

Rollup.prototype = Object.create(Filter.prototype);
Rollup.prototype.constructor = Rollup;
Rollup.prototype.targetExtension = ['js'];

Rollup.prototype.baseDir = function () {
  return __dirname;
};

Rollup.prototype.processString = function (string, relativePath) {
  const entry = path.resolve('.', relativePath);
  return rollup.rollup({
    entry,
    external: ['jquery', 'modernizr', 'text', 'angular', 'lazyload', 'swiper', 'vue', 'bootstrap/scrollspy', 'jsonlylightbox'],
    globals: {
      angular: 'angular',
      vue: 'vue'
    },
    plugins: [
      {
        name: 'rollup-plugin-load-from-param',
        load(id) {
          if (id === entry) {
            return string;
          }
        }
      },
      nodeResolve({ jsnext: true, main: true }),
      commonjs(),
      json(),
      babel({
        exclude: 'node_modules/**',
        presets: 'es2015-rollup',
        runtimeHelpers: true
      }),
      uglify()
    ]
  }).then(function (bundle) {
    var result = bundle.generate({
      format: 'amd'
    });
    return { output: result.code };
  });
};

module.exports = Rollup;
