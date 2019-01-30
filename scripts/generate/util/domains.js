const debug = require('debug')('alodi:generate:domains');
const path = require('path');
const fse = require('fs-extra');
const _ = require('lodash');

async function getTemplate(name) {
  let templateContent = await fse.readFile(path.join(__dirname, '../templates/' + name), 'utf-8');
  let template = _.template(templateContent)
  return template;
}

async function run({outputdir, root, models}) {
  debug('run',...arguments);
  let templates = {
    //collection: {
      //template: await getTemplate('domains/collection.js.tpl'),
      //fileType: 'js'
    //},
    collection: {
      template: await getTemplate('domains/collection.dart.tpl'),
      fileType: 'dart'
    },
    //model: {
      //template: await getTemplate('domains/model.js.tpl'),
      //fileType: 'js'
    //},
    model: {
      template: await getTemplate('domains/model.dart.tpl'),
      fileType: 'dart'
    },
  };

  Object.entries(models).forEach(async ([modelName, types]) => {
    let data = {
      modelName: modelName,
      // TODO get path
      path: '/todo',
      rpcs: [],
      model: root.components.schemas[modelName],
    //rpcs: [
    //{
    //path: '/login',
    //name: 'login',
    //},
    //{
    //path: '/logout',
    //name: 'logout',
    //},
    //],
    };
    types = types || {
      collection: 1,
      model: 1
    };

    Object.keys(types).forEach(async (type) => {
      let {template, fileType} = templates[type];
      debug('template',data);
      let r = template(data);

      r = r.split('\n').filter(a=>a.trim().length).join('\n');


      let codeGenFile = path.join(outputdir, modelName + type[0].toUpperCase() + type.substring(1) + '.' + fileType);
      await fse.ensureFile(codeGenFile);
      fse.writeFile(codeGenFile, r);
    });
  });

}

module.exports.run = run;
