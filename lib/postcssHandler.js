let postcss = require('postcss');
// let cssnano = require('cssnano');
// let cssnext = require('postcss-cssnext');
let assets = require('postcss-assets');
let atImport = require('postcss-import');
let fs = require('fs');

const assetsPlugin = assets();
const plugins = [
  atImport({
    plugins: [assetsPlugin]
  }),
  assetsPlugin
];

module.exports = function (file, res, next) {
  fs.readFile(file, 'utf-8', (err, content) => {
    if (err) next(err);
    else {
      postcss(plugins)
        .process(content, { from: file, to: file })
        .then(result => {
          res
            .type('text/css')
            .send(result.css);
        })
        .catch(error => {
          if (error.name === 'CssSyntaxError') {
            next(new Error(error.message + error.showSourceCode()));
          } else {
            next(error);
          }
        });
    }
  });
};
