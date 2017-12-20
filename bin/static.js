let path = require('path');
let os = require('os');
let fs = require('fs');
let nunjucksEnvFactory = require('../lib/nunjucksEnv');

const tasks = {
  'index.html': 'home'
};

const nunjucksEnv = nunjucksEnvFactory({ isDev: false });
const VIEWS_ROOT = path.resolve('./views');
const PUBLIC_ROOT = path.resolve('./public');

Object.keys(tasks).forEach(target => {
  const njkFile = path.join(VIEWS_ROOT, tasks[target] + '.njk');
  nunjucksEnv.render(njkFile, (err, html) => {
    if (err) {
      console.error(err);
      process.exit(-1);
    } else {
      const targetFile = path.join(PUBLIC_ROOT, target);
      fs.writeFile(targetFile, html, 'utf-8', writeErr => {
        if (writeErr) {
          console.error(writeErr);
          process.exit(-1);
        } else {
          console.log(`写入文件: ${targetFile}`);
        }
      });
    }
  });
});

console.log('end !');
