const debug = require('debug')('alodi:generate');
const path = require('path');
const fse = require('fs-extra');
const _ = require('lodash');
_.templateSettings.interpolate = /<%=([\s\S]+?)%>/g;
const helpers = require('./helper.js');


async function getTemplate(name) {
  let templateContent = await fse.readFile(path.join(__dirname, '../templates/' + name), 'utf-8');
  let template = _.template(templateContent)
  return template;
}

const defaults = {
  filter: {
  },
  actions: {
    create: 1,
    detail: 1,
    delete: 1,
    edit: 1,
  },
  pagination: {
    'page-sizes': [10, 20, 50],
    layout: 'total, sizes, prev, pager, next, jumper',
  },
};
let templates;
async function init() {
  templates = {
    list: await getTemplate('pages/index.ejs'),
    picker: await getTemplate('pages/picker/index.ejs'),
    detail: await getTemplate('pages/detail/index.ejs'),
    creator: await getTemplate('pages/detail/creator.ejs'),
  };
}
init();

async function run({outputdir, root, options}) {
  debug('run');
  let {modelName, type, ...option} = options;

  let schema = root.components.schemas[modelName];

  debug('pagetype:', type);
  let fields,
    filter,
    pagination;
  let actions = {};
  fields = _.get(options, 'fields', schema.properties);
  filter = _.get(options, 'filter', defaults.filter);
  pagination = _.get(options, 'pagination', defaults.pagination);

  actions = _.get(options, 'actions', defaults.actions);

  let enums = [];
  Object.entries(schema.properties).filter(([name, item]) => {
    return !!item.enum
  }).forEach(([name, item]) => {
    let xenum = item['x-enum'] || [];
    if (!xenum.length) {
      xenum = item.enum.map(a => {
        return {
          value: a,
          label: a
        }
      });
    }
    let obj = {
      name,
      enum: item.enum,
      'x-enum': xenum
    };
    enums.push(obj);
  });

  let data = {
    fields,
    schema,
    boneData:helpers.boneData(schema),
    modelName,
    storeName: modelName.toLowerCase(),
    filter,
    pagination,
    actions,
    enums,
  };
  //debug(templates[type]);

  debug('render.data',data);

  let r = templates[type](data);

  //r = r.split('\n').filter(line=>line.trim().length>0).join('\n');
  r = helpers.format(r,'.vue');


  let typefile = path.join(outputdir, 'pages', modelName.toLowerCase(), ({
      'list': 'index',
      'detail': 'detail/index',
      'creator': 'detail/creator',
      'picker': 'picker/index'
    })[type] + '.vue');

  await fse.ensureFile(typefile);
  fse.writeFile(typefile, r);

}

module.exports.run = run;

