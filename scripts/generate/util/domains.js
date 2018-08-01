const debug = require('debug')('alodi:generate');
const path = require('path');
const fse = require('fs-extra');
const _ = require('lodash');

async function getTemplate(name){
  let templateContent = await fse.readFile(path.join(__dirname, '../templates/'+name),'utf-8');
  let template = _.template(templateContent)
  return template;
}

async function run({outputdir,root,models}) {
  debug('run');
  let templates = {
    collection:await getTemplate('domains/collection.tpl'),
    model:await getTemplate('domains/model.tpl'),
  };

  Object.entries(models).forEach(async ([modelName,types])=>{
    let data = {
      modelName: modelName,
      // TODO get path
      path:'/todo',
      rpcs:[],
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
    Object.keys(types||{collection:1,model:1}).forEach(async (type)=>{
      let r = templates[type](data);
      let typefile = path.join(outputdir,modelName+type[0].toUpperCase()+type.substring(1)+'.js');
      await fse.ensureFile(typefile);
      fse.writeFile(typefile,r);
    });
  });

}

module.exports.run = run;

