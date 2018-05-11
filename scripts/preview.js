const path = require('path');
const opn = require('opn');
const express = require('express');
const debug = require('debug')('alodi:preview');

const cwd = process.cwd();
const pathToSwaggerUi = require('swagger-ui-dist').absolutePath();


function run(specfile) {
  const app = express();
  let port = process.env.PORT || 3000;
  debug('port', port);

  let normalizefile,
    realspecfile;

  if (specfile) {
    normalizefile = path.join('/', path.normalize(specfile));
    realspecfile = path.resolve(path.join(cwd, specfile));
    app.get(normalizefile, function(req, res) {
      debug('sendFile', req.path);
      res.sendFile(realspecfile);
    });
  }

  app.use(express.static(pathToSwaggerUi));
  app.use(express.static(path.join(cwd, 'dist')));


  app.listen(port, function() {
    if (specfile) {
      opn(`http://127.0.0.1:${port}?url=${normalizefile}`);
    } else {
      opn(`http://127.0.0.1:${port}?url=http://127.0.0.1:${port}/index.json`);
    }
  });
}

exports.run = run;

if (require.main == module) {
  run();
}
