const debug = require('debug')('alodi:generate');
const path = require('path');
const fse = require('fs-extra');
const yaml = require('js-yaml');
const parseYAML = yaml.safeLoad;
const stringifyYAML = yaml.safeDump;
const _ = require('lodash');
const inquirer = require('inquirer');
const {Observable} = require('rxjs');


const genDefines = require('./util/defines.js').run;
const genDomains = require('./util/domains.js').run;
const genStores = require('./util/stores.js').run;
const genPages = require('./util/pages.js').run;


inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'))

let spec;
async function run() {
  let answers;
  answers = await getAnswers();
  let {config,project} = answers;
  debug(answers);

  let cwd = process.cwd();

  let content = await fse.readFile(path.join(process.cwd(), 'dist/index.json'),'utf-8');
  let root = JSON.parse(content);


  //if(Object.keys(project.defines||{}).length){
    //let definesDir = path.join(cwd,config.paths.defines);
    //await fse.ensureDir(definesDir);
    //await genDefines({root:root,outputdir:definesDir, models: project.defines});
  //}

  //if (Object.keys(project.domains||{}).length) {
    //let domainsDir = path.join(cwd,config.paths.domains);
    //await fse.ensureDir(domainsDir);
    //await genDomains({root:root,outputdir:domainsDir, models: project.domains});
  //}
  //if (Object.keys(project.stores||{}).length) {
    //let storesDir = path.join(cwd,config.paths.stores);
    //await fse.ensureDir(storesDir);
    //await genStores({root:root,outputdir:storesDir, models: project.stores});
  //}
  if (Object.keys(project.pages||{}).length) {
    let pagesDir = path.join(cwd,config.paths.pages);
    await fse.ensureDir(pagesDir);
    await genPages({root:root,outputdir:pagesDir, models: project.pages});
  }
}


async function getAnswers() {
  let cwd = process.cwd();
  let configFile = path.join(cwd,'code-gen/config.yaml');
  let config = await parseYamlFile(configFile);

  let projectFile = path.join(cwd,'code-gen/project.yaml');
  let project = await parseYamlFile(projectFile);
  return {config,project};
}

async function parseYamlFile(file) {
  let content = await fse.readFile(file, 'utf-8');
  let obj = parseYAML(content);
  return obj;
}

module.exports.run = run;
