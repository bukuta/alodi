const debug = require('debug')('alodi:generate');
const path = require('path');
const fse = require('fs-extra');
const yaml = require('js-yaml');
const parseYAML = yaml.safeLoad;
const stringifyYAML = yaml.safeDump;
const _ = require('lodash');
const inquirer = require('inquirer');
const {Observable} = require('rxjs');

const helpers = require('./util/helper.js');


const genDefines = require('./moulds/defines').run;
const genDomains = require('./moulds/domains').run;
const genStores = require('./moulds/stores').run;
const genPages = require('./moulds/pages').run;


function getGenator(name){
  let r = require('./moulds/'+name).run;
  return r;
}

inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'))

let spec;
async function run() {
  let answers;
  answers = await getAnswers();
  let {config, project} = answers;
  debug(answers);

  let cwd = process.cwd();

  let content = await fse.readFile(path.join(process.cwd(), 'dist/index.json'), 'utf-8');
  let root = JSON.parse(content);


  for (let [name, item] of Object.entries(project)) {
    for(let mouldName of Object.keys(item)){
      let outputDir = path.join(cwd, config.paths[mouldName]);
      await fse.ensureDir(outputDir);

      let options = item[mouldName];
      if(!Array.isArray(options)){
        options = [options];
      }

      for(let option  of  options){
        let genterator = getGenator(mouldName);
        await genterator({
          root,
          outputDir,
          models: {
            [name]:name,
          },
          options: {...option, helpers},
        });
      }

      //if (_.has(item, 'domains')) {
      //await genDomains({
      //root: root,
      //outputdir: domainsDir,
      //models: {
      //[name]: {collection:1,model:1}
      //}
      //});
      //}

      //if (_.has(item, 'pages')) {
      //let pagesDir = path.join(cwd, config.paths.pages);
      //await fse.ensureDir(pagesDir);

      //item.pages.forEach(async(page)=>{
      //await genPages({
      //root: root,
      //outputdir: pagesDir,
      //options: {modelName:name,...page, helpers}
      //});
      //});
      //}
    }
  }
}


async function getAnswers() {
  let cwd = process.cwd();
  let configFile = path.join(cwd, 'code-gen/config.yaml');
  let config = await parseYamlFile(configFile);

  let projectFile = path.join(cwd, 'code-gen/project.yaml');
  let project = await parseYamlFile(projectFile);
  return {
    config,
    project
  };
}

async function parseYamlFile(file) {
  let content = await fse.readFile(file, 'utf-8');
  let obj = parseYAML(content);
  return obj;
}

module.exports.run = run;
