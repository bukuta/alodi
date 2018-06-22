import React, {Component} from 'react';
import blessed from 'blessed';
import {render} from 'react-blessed';

import App from './components/App.js';

const debug = require('debug')('preview3');

function run(){
  debug('run');
  // Creating our screen
  const screen = blessed.screen({
    autoPadding: true,
    smartCSR: true,
    fullUnicode:true,
    title: 'react-blessed hello world',
  });

  // Adding a way to quit the program
  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });

  const component = render(<App />, screen);
}

export default run;
