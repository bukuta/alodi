// 生成代码
// - 由schema定义，生成entity
// - 由schema定义，生成default-view-shape,default-edit-shape,default-create-shape,
// - 由schema定义，生成mock-data.js
// 目录结构为:
//  resources/
//  ├── :resourceName/
//  │   ├── shapes/
//  │   │   ├── create.js
//  │   │   ├── index.js
//  │   │   └── viewer.js
//  │   ├── Entity.js
//  │   ├── data.js
//  │   └── index.js
//  ├── admin/
//  │   ├── shapes/
//  │   │   ├── editor.js
//  │   │   ├── index.js
//  │   │   └── viewer.js
//  │   ├── Entity.js
//  │   ├── data.js
//  │   └── index.js

//
//
//区分生成的代码和手工代码，
//
//

const path = require('path');
const fse = require('fs-extra');
const Mock = require('mockjs');

const _ = require('lodash');
const debug = require('debug')('generator');
const debug_todo = require('debug')('generator:TODO');

const debug_error = require('debug')('error');
const debug5 = require('debug')('collection');
const debug6 = require('debug')('collection');

function collectMocksFromEntity(schema, root) {
  debug6(schema);
  let properties = schema.properties;
  let r = {};
  let type = '';
  if (properties) {
    // object
    for (let name in properties) {
      let value = properties[name];
      if (value.hasOwnProperty('x-mock')) {
        r[name] = value['x-mock'];
      } else if (value.hasOwnProperty('$ref')) {
        //debug5(name, value)
        let node = pickNode(root, value['$ref']);
        //debug5(node);
        let m = collectMocksFromEntity(node, root);
        if (m.type == 'enum') {
          r[name + '|1'] = m.mock;
        } else {
          r[name] = m.mock;
        }
      } else if (value.type == 'object') {
        //debug5('object', value);
        let m = collectMocksFromEntity(value, root);
        if (m.type == 'enum') {
          r[name + '|1'] = m;
        } else if (m.type == 'array') {
          r[name + '|1-10'] = m;
        }
      } else if (value.type == 'array') {
        debug5('array', value);
        let items = value.items;
        if (items.oneOf) {
          items = items.oneOf;
          debug5('oneOf', items);
        } else if (items.allOf) {
          items = items.allOf;
          debug5('allOf', items);
        } else if (items.anyOf) {
          items = items.anyOf;
          debug5('anyOf', items);
        } else {
          items = [value.items];
        }
        let m = items.map(item => collectMocksFromEntity({
          properties: {
            items: item
          }
        }, root).mock.items);
        type = 'array';
        r[name + '|1-10'] = m;
      }
    }
  } else {
    // refs/enum
    if (schema.hasOwnProperty('x-mock')) {
      r = schema['x-mock'];
    } else if (schema.hasOwnProperty('enum')) {
      r = schema['enum'];
      type = 'enum';
    }
  }
  return {
    type,
    mock: r
  };
}

function pickNode(root, keypath) {
  let paths = keypath.replace(/^@#\//, '').replace(/^#\//, '').split('/').filter(k => k);
  let node = paths.reduce((last, path) => {
    if (last && last[path]) {
      return last[path];
    }
    return null;
  }, root);

  return node;
}

function collectMocksFromResponse(response, root) {
  let content = response && response.content && response.content['application/json'];
  let m;
  if (content) {
    content = content.schema;
    debug6('collectMocksFromResponse', content);
    if (content.hasOwnProperty('$ref')) {
      let node = pickNode(root, content['$ref']);
      debug6('collectMocksFromResponse', node);
      m = collectMocksFromEntity(node, root).mock;
    } else {
      debug6(content);
      m = collectMocksFromEntity(content, root).mock;
    }
  }
  debug6('collectMocksFromEntity.result', m);
  return m;
}

async function getTemplate(name) {
  let templateContent = await fse.readFile(path.join(__dirname, './templates/' + name + '.ejs'), 'utf-8');
  let template = _.template(templateContent)
  return template;
}

function collectShapes(schema) {
  // schema.properties.xxx.x-gen-shape.x-zzz
  let names = Object.keys(schema.properties);
  let scenes = {};
  let nameShapes = names.map(name => {
    return {
      name,
      shapes: schema.properties[name]['x-gen-shape']
    };
  }).filter(item => !!item.shapes).map(item => {
    Object.keys(item.shapes).forEach(scenename => {
      scenes[scenename] = scenes[scenename] || [];
      scenes[scenename].push({
        name: item.name,
        render: item.shapes[scenename]
      });
    })
  });
  let renameScenes = {};
  Object.keys(scenes).forEach(name => {
    renameScenes[name.replace('x-', '')] = scenes[name];
  });
  debug(renameScenes);
  return renameScenes;
}

async function genEntities({outputDir, root, models, options}) {
  let templates = {
    index: await getTemplate('index'),
    creator: await getTemplate('creator'),
    entity: await getTemplate('entity'),
    //shape:await getTemplate('shape'),
    data: await getTemplate('data'),
    mock: await getTemplate('mock'),
  };

  //let content = await readFile(specFile,'utf-8');
  //let root = JSON.parse(content);
  let schemas = root.components.schemas;
  let names = Object.keys(models);
  let modelName = Object.keys(models)[0];


  for (var name of names) {
    let schema = schemas[name];
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

    debug(name, schema);
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


    if (schema['x-gen-skip']) {
      debug('x-gen-skip', name);
      continue;
    }
    name = name.toLowerCase();

    let entityfile = path.join(outputDir, name, 'entity.js');
    await fse.ensureFile(entityfile)
    await fse.writeFile(entityfile, templates.entity({
      entity: schema
    }));

    let creatorfile = path.join(outputDir, name, 'creator.vue');
    await fse.ensureFile(creatorfile)

    let data = {
      fields: _.get(options, 'fields', schema.properties),
      schema,
      boneData: options.helpers.boneData(schema),
      modelName,
      storeName: modelName.toLowerCase(),
      filter: _.get(options, 'filter', defaults.filter),
      enums,
    };
    //debug(templates[type]);
    await fse.writeFile(creatorfile, templates.creator( data));

    let mockfile = path.join(outputDir, name, 'mock.js');
    let mockdatafile = path.join(outputDir, name, 'data.js');

    //let shapes = collectShapes(schema);

    //for(var scenename in shapes){
    //let shapefile = path.join(outputDir, name,`shapes/${scenename}.js`);
    //await fse.ensureFile(shapefile)
    //await fse.writeFile(shapefile,templates.shape({shape:shapes[scenename]}));
    //}

    let mock = collectMocksFromEntity(schema, root);

    await fse.ensureFile(mockfile)
    await fse.writeFile(mockfile, templates.mock({
      data: mock.mock
    }));

    await fse.ensureFile(mockdatafile)
    let mockdata = Mock.mock(mock.mock);
    await fse.writeFile(mockdatafile, templates.data({
      data: mockdata
    }));

    let indexfile = path.join(outputDir, name, 'index.js');
    debug(indexfile);
    await fse.ensureFile(indexfile)
    await fse.writeFile(indexfile, templates.index({
      shapes: []
    }));

    debug(entityfile);
  }
}
//process.on('warning',function(e){
//debug(e);
//});


module.exports.run = genEntities;

//genEntities(path.join(__dirname,'../../dist/gen'));
