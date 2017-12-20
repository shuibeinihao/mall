let path = require('path');

module.exports = function (file = '') {
  if (file.startsWith('/') || file.startsWith('http')) {
    return file;
  }

  return path.join('/assets', file);
};
