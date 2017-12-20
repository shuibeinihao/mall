let babel = require('rollup-plugin-babel');
let uglify = require('rollup-plugin-uglify');
let nodeResolve = require('rollup-plugin-node-resolve');
let commonjs = require('rollup-plugin-commonjs');

export default {
  entry: 'assets/js/polyfill.js',
  format: 'iife',
  sourceMap: true,
  dest: 'public/vendor/polyfill.js',
  plugins: [
    nodeResolve({ jsnext: true, main: true }),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    }),
    uglify()
  ]
};
