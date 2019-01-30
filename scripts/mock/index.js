const express = require('express');
const debug = require('debug')('local-mock');
const debug_error = require('debug')('local-mock:error');

function run(){
  let app = express();
  let port = process.env.PORT || 3003;

  const mockrouter = require('./server/mock.js').router;
  app.use(mockrouter);

  //const consolerouter = require('./console.js').router;
  //app.use('/:console',consolerouter);

  app.listen(port, function() {
    debug('listening', port);
  });

  process.on('warning', function(warn) {
    debug_error(warn);
  });
}
exports.run = run;

if(require.main==module){
  run();
}
