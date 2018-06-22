const debug = require('debug')('alodi:generate');
const path = require('path');
const fse = require('fs-extra');
const _ = require('lodash');


function genModel(){
}
function genCollection(){
}

async function run() {
  debug('run');

  let modelTemplateSource = await fse.readFile(path.join(__dirname, './templates/model.tpl'), 'utf-8');
  let modelTemplate = _.template(modelTemplateSource);

  let data = {
    modelName: 'User',
    rpcs: [
      {
        path: '/login',
        name: 'login',
      },
      {
        path: '/logout',
        name: 'logout',
      },
    ],
  };
  let r = modelTemplate(data);
  debug(r);
}

module.exports.run = run;

