let path = require('path');
let fs = require('fs');
let url = require('url');
let rollupHandler = require('./rollupHandler');
let postcssHandler = require('./postcssHandler');

const handlerMap = {
  '.js': rollupHandler,
  '.css': postcssHandler
};

module.exports = function (baseDir) {
  return function (req, res, next) {
    const relativeFile = url.parse(req.url).pathname.substr(1);
    const targetFile = path.resolve(baseDir, relativeFile);
    const extension = path.extname(targetFile).toLowerCase();
    const handler = handlerMap[extension];

    if (fs.existsSync(targetFile) && handler) {
      handler(targetFile, res, next);
    } else if (fs.existsSync(targetFile)) {
      res.sendFile(targetFile);
    } else {
      next();
    }
  };
};
