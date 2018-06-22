import React, {Component} from 'react';
import blessed from 'blessed';
import {render} from 'react-blessed';

import App from './App.js';

function run(){
  const screen = blessed.screen({
    autoPadding: true,
    smartCSR: true,
    title: 'react-blessed hello world'
  });

  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });


  const component = render(<App />, screen);
}

export default run;
