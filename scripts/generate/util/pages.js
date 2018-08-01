const debug = require('debug')('alodi:generate');
const path = require('path');
const fse = require('fs-extra');
const _ = require('lodash');
_.templateSettings.interpolate = /<%=([\s\S]+?)%>/g;


async function getTemplate(name){
  let templateContent = await fse.readFile(path.join(__dirname, '../templates/'+name),'utf-8');
  let template = _.template(templateContent)
  return template;
}

async function run({outputdir,root,models}) {
  debug('run');
  let templates = {
    list:await getTemplate('pages/index.ejs'),
    detail:await getTemplate('pages/detail/index.ejs'),
  };

  Object.entries(models).forEach(async ([modelName,types])=>{

    let schema = root.components.schemas[modelName];

    Object.keys(types||{list:1,detail:1}).forEach(async (type)=>{
      let data = {
        schema:schema,
        modelName: modelName,
        storeName: modelName.toLowerCase(),
        filter:types[type].filter,
        pagination:types[type].pagination,
        actions:types[type].actions,
      };

      let r = templates[type](data);
      let typefile = path.join(outputdir,'pages', modelName.toLowerCase()+(type=='detail'?'.detail':'')+'.vue');
      await fse.ensureFile(typefile);
      fse.writeFile(typefile,r);
    });
  });

}

module.exports.run = run;



