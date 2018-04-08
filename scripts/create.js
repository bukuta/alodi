//#! /usr/bin/env node
/**
 * 新建文档仓库
 *
 * 1. 从命令行接收 项目名？ 版本号? 标题？说明?
 * 2. copy -r 文件
 * 3 捡的特定文件内变量
 */

const path = require('path');

const fse = require('fs-extra');
const inquirer = require('inquirer');
const _ = require('lodash');
const debug = require('debug')('create');


const cwd = process.cwd();

async function getParams() {
  let answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'the name of the project ',
    },
    {
      type: 'input',
      name: 'version',
      message: 'the version of the docs ',
    },
    {
      type: 'input',
      name: 'title',
      message: 'the title of the project ',
    },
    {
      type: 'editor',
      name: 'description',
      message: 'the description of the project ',
    },
  ])
  debug('answers', answers);
  return answers;
}

async function run() {
  let params = await getParams();
  let templatebase = path.resolve(path.join(__dirname, './template'));
  let target = cwd;
  debug('target', target);
  debug('template', templatebase);

  await fse.copy(templatebase, target, {
    overwrite: true,
    preserveTimestamps: true
  })

  let files = [
    'package.json',
    'src/main.yaml',
    'src/tags.yaml',
  ];

  files.map(file => {
    return path.join(target, file);
  }).map(async (file) => {
    let content = await fse.readFile(file);
    let compile = _.template(content.toString());
    let r = compile(params);
    await fse.writeFile(file, r);
  })

  // npm install
}

if (require.main == module) {
  run();
}
exports.run = run;
