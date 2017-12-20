let co = require('co');
let httpRequest = require('./httpRequest');
let mapValues = require('lodash.mapvalues');

module.exports = function(req, map){
  return co(function * () {
    let result = yield mapValues(map, item => httpRequest(req, item.url, item.method, JSON.stringify(item.body)));
    return result;
  });
};
