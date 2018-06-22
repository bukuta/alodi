const debug = require('debug')('config');
const os = require('os');
const blessed = require('blessed');
//const nc = require('ncurses');
require('babel-register')({});
const start = require('./components/index.js').default;


function run(){
  debug('run');
  start();
}

exports.run = run;
