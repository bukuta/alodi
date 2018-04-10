#!/usr/bin/env node

const program = require('commander');
const path = require('path');
const debug = require('debug')('cli');
const child_process = require('child_process');

const createUtil = require('../scripts/create.js');
const buildUtil = require('../scripts/build.js');
const previewUtil = require('../scripts/preview.js');
const preview2Util = require('../scripts/preview2.js');
const mockUtil = require('../scripts/mock');

debug('init');

program.version('1.0.0')
  .command('create')
  .description('create default docs with openapi3.0 specs')
  .action(function(env, options) {
    debug('create');
    //debug('env',env)
    //debug('options',options)
    createUtil.run();
  });

program.command('build')
  .description('build docs')
  .action(function(env, options) {
    debug('build');
    buildUtil.run();
  });

program.command('preview <file>')
  .description('preview docs with openapi3.0 specs')
  .action(function(file, options) {
    debug('preview')
    debug('file', file)
    previewUtil.run(file);
  });

program.command('preview2 <file>')
  .description('preview docs with openapi3.0 specs')
  .action(function(file, options) {
    debug('preview')
    debug('file', file)
    preview2Util.run(file);
  });


program.command('mock')
  .description('run mock server')
  .action(function(env, options) {
    debug('mock');
    mockUtil.run();
  });

program.parse(process.argv);

process.on('exit', function(err) {
  debug('exit', err);
})

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
