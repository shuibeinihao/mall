let Funnel = require('broccoli-funnel');
let BroccoliMergeTrees = require('broccoli-merge-trees');
let postcssFunnel = require('broccoli-postcss');
let postcssPlugins = require('./plugins/postcssPlugins');
let rollupBroccoliPlugin = require('./plugins/rollupBroccoliPlugin');
let path = require('path');

const RootDir = 'assets';
const CssDir = 'css';
const JsDir = 'js';
const FontsDir = 'fonts';
const exclude = ['**/_*', '**/*.m.js'];

const DestDir = 'assets';

const cssFunnel = new Funnel(RootDir, {
  destDir: path.join(DestDir, CssDir),
  srcDir: CssDir,
  allowEmpty: true,
  exclude
});

const jsFunnel = new Funnel(RootDir, {
  destDir: path.join(DestDir, JsDir),
  srcDir: JsDir,
  allowEmpty: true,
  exclude
});

const fontsFunnel = new Funnel(RootDir, {
  destDir: path.join(DestDir, FontsDir),
  srcDir: FontsDir,
});

module.exports = new BroccoliMergeTrees([
  postcssFunnel(cssFunnel, { plugins: postcssPlugins }),
  rollupBroccoliPlugin(jsFunnel),
  fontsFunnel
]);
