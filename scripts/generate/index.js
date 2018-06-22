const debug = require('debug')('alodi:generate');
const path = require('path');
const fse = require('fs-extra');
const _ = require('lodash');
const inquirer = require('inquirer');
const {Observable} = require('rxjs');

inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'))

// inquireer 选择
// 生成类型: 多选
//  pages
//  domains
//  defines
//
// domains:
//  选择实体
//
// defines:
//  选择shapes
//
// pages:
//  选择接口:
//
let spec;
async function run() {
  let answers;
  answers = await getAnswers();
  //answers = {
    //types: ['Domains', 'Defines', 'Pages'],
    //path: 'api-docs/dist/index.json',
    //models: ['Admin', 'Role'],
    //target: 'api-docs',
    //apis: [
      //{
        //path: '/admins',
        //item: [Object]
      //},
      //{
        //path: '/admins/{adminId}',
        //item: [Object]
      //},
      //{
        //path: '/users',
        //item: [Object]
      //},
      //{
        //path: '/users/{userId}',
        //item: [Object]
      //}]
  //};

  if (answers.types.includes('Domains')) {
    await genDomains(spec, answers);
  }
  if (answers.types.includes('Defines')) {
    await genDefines(spec, answers);
  }
  if (answers.types.includes('Pages')) {
    await genPages(spec, answers);
  }
}


async function getAnswers() {
  let answers = await inquirer.prompt([
    {
      name: 'types',
      type: 'checkbox',
      message: 'select what you want generate',
      choices: [
        {
          name: 'Domains',
          checked: true
        },
        {
          name: 'Defines',
          checked: true
        },
        {
          name: 'Pages',
          checked: true
        },
      ],
    },
    {
      name: 'path',
      type: 'fuzzypath',
      message: 'where your spec.json',
      pathFilter(isDirector, nodePath) {
        if (isDirector) {
          return !nodePath.startsWith('.');
        } else {
          return (!nodePath.startsWith('.') && nodePath.endsWith('.json'));
        }
      },
      rootPath: './',
      suggestOnly: false,
      when(current) {
        if (!current.types.length) {
          process.exit(0);
        }
        return true;
      },
    },
    {
      name: 'models',
      type: 'checkbox',
      paginated: true,
      message: 'select models you want generate from',
      choices: async function (current) {
        debug('current', current);
        let specfile = path.join(process.cwd(), current.path);
        spec = await fse.readFile(specfile, 'utf-8');
        //debug('spec',spec);
        spec = JSON.parse(spec);
        let models = _.get(spec, 'components.schemas');
        debug('models', models);
        models = Object.entries(models)
          .map(([name, item]) => {
            return {
              name
            };
          });

        return models;

        // read json. parse models;
        return [
          {
            name: 'Domains',
            checked: true
          },
          {
            name: 'Defines',
            checked: true
          },
          {
            name: 'Pages',
            checked: true
          },
        ];
      },
    },
    {
      name: 'target',
      type: 'fuzzypath',
      message: 'where your target: ',
      default: 'src/packages/resources',
      pathFilter(isDirector, nodePath) {
        return isDirector&&!nodePath.startsWith('.');
      },
      rootPath: './',
      suggestOnly: false,
    },
    {
      name: 'apis',
      type: 'checkbox',
      paginated: true,
      message: 'select apis you want generate from',
      when(current) {
        return current.types.includes('Pages');
      },
      choices(current) {
        debug('current', current);
        let apis = Object.entries(spec.paths)
          .map(([path, item]) => {
            return {
              name: `${path}`,
              value: {
                path,
                item
              },
            };
          });
        return apis;
      },
    },
  ]);
  debug('answers', answers);
  return answers;
}

module.exports.run = run;
