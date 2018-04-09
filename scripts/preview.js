const opn = require('opn');
const path = require('path');
const express = require('express');
const pathToSwaggerUi = require('swagger-ui-dist').absolutePath();

const cwd = process.cwd();

function run(){

  const app = express();

  app.use(express.static(pathToSwaggerUi));
  app.use(express.static(path.join(cwd,'dist')));

  const port = process.env.PORT||3000

  app.listen(port,function(){
    opn(`http://127.0.0.1:${port}?url=http://127.0.0.1:${port}/index.json`);
  });

}

exports.run = run;


if (require.main == module) {
  run();
}
