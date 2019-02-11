const debug = require('debug')('alodi:generate');
const path = require('path');
const fse = require('fs-extra');
const _ = require('lodash');


async function getTemplate(name){
  let templateContent = await fse.readFile(path.join(__dirname, './templates/'+name),'utf-8');
  let template = _.template(templateContent)
  return template;
}

async function run({outputDir,root,models}) {
  debug('run');
  let templates = {
    list:await getTemplate('list.tpl'),
    detail:await getTemplate('detail.tpl'),
  };

  Object.entries(models).forEach(async ([modelName,types])=>{

    let schema = root.components.schemas[modelName];
    let properties={};
    Object.entries(schema.properties).forEach(([name,item])=>{
      if(item.type=='object'||item.type=='array'){
      }else{
        properties[name]='';
      }
    });

    Object.keys(types||{list:1,detail:1}).forEach(async (type)=>{
      let filter = _.get(types,[type,'filter']);
    let data = {
      modelName: modelName,
      // TODO get path
      path:'/todo',
      properties:properties,
      filter,
      rpcs:[],
    };

      let r = templates[type](data);
      let typefile = path.join(outputDir,'stores', modelName.toLowerCase()+(type=='detail'?'.detail':'')+'.js');
      await fse.ensureFile(typefile);
      fse.writeFile(typefile,r);
    });
  });

}

module.exports.run = run;


