const debug = require('debug')('alodi:generate:domains');
const path = require('path');
const fse = require('fs-extra');
const _ = require('lodash');

async function getTemplate(name,options) {

  let lang = _.get(options,'lang','js');

  let templateContent = await fse.readFile(path.join(__dirname, `./templates/${name}.${lang}.tpl`), 'utf-8');
  let template = _.template(templateContent)
  return {template,fileType:lang};
}

async function run({outputDir, root, models,options}) {
  debug('run',models, options,);
  Object.entries(models).forEach(async ([modelName]) => {
    let data = {
      modelName: modelName,
      // TODO get path
      path: options.path,
      rpcs: [],
      model: root.components.schemas[modelName],
    };

    let types = ['collection','model'].filter(key=>options[key]);

    for(let type of types){
      let {template, fileType} = await getTemplate(type, options[type]);
      debug(type,'template',data);
      debug(type,options,options[type]);
      let langOptions = options[type]['lang-options']||{};
      let r = template({...data,options:langOptions});

      r = r.split('\n').filter(a=>a.trim().length).join('\n');

      let codeGenFile = path.join(outputDir, modelName +(langOptions.fileSuffix||'')+ '.' + fileType);
      await fse.ensureFile(codeGenFile);
      await fse.writeFile(codeGenFile, r);
    }
  });

}

module.exports.run = run;
