const debug = require('debug')('helper');
const prettier = require('prettier');

function truncateWhiteSpaceLine(content) {
  return content.split('\n')
    .map(line => line.trim().length == 0 ? '' : line)
    .join('\n');
  return content.split('\n').filter(line => line.trim().length > 0).join('\n');
}

const options = {
  '.vue': {
    semi: true,
    parser: 'vue',
  }
};

function formatter(content, filetype) {
  let option = options[filetype];
  debug(option);
  content = truncateWhiteSpaceLine(content);
  //content = prettier.format(content,options[filetype]);
  //console.log(content);
  return content;
}

const boneMock = {
  string: '',
  integer: 0,
};

function boneData(schema){
  let bone = {};
  for(let [name,define] of Object.entries(schema.properties)){
    bone[name]=boneMock[define.type];
  }
  return bone;
}

exports.format = formatter;
exports.boneData = boneData;
