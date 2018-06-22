const debug = require('debug')('app');
import React, { Component } from 'react';
import blessed from 'blessed';
import { render } from 'react-blessed';

import { paths } from './data.js';
import { styles } from './styles.js';

import Detail from './Detail.js';

class App extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      paths: [...paths],
      current: 1,
    };
  }
  onKeyDown(key,ele) {
    debug('onKeyDown',key,ele,ele.target);

    let current = this.state.current + 1;
    if (current > this.state.paths.length - 1) {
      current = 0;
    }

    this.setState({
      current
    });
  }

  onItem(item,index,key,event){
    debug('onItem',item.path,index,key);
  }

  componentDidMount() {
    this.refs.form.focus();
  }

  renderLine(item,index){
    let content = `[${item.method.padEnd(4,' ').toUpperCase()}] ${item.path} ${item.summary}`;
    return (
      <box
        top={index}
        key={item.method+item.path}
        onKeypress={this.onItem.bind(this,item,index)}
        class={styles.line.self}
        >
        <checkbox checked onKeypress={this.onItem.bind(this,item,index)}></checkbox>
        <box class={styles.line.content}>
          {content}
        </box>
      </box>
    );
  }

  render() {
    let current = this.state.current;
    let lines = this.state.paths.map((item, index) => {
      let classNames = [index == current ? styles.line.selected : {}];
      return this.renderLine(item,index);
    });
    return (
      <element>
      <form
        top="top"
        class={styles.form}
        scrollable
        alwaysScroll
        ref="form"
        keys
        vi
        scrollbar= {
          {
            ch: ' ',
            inverse: true
          }
        }
        label="apis"
        onKeypress={this.onKeyDown.bind(this)}
      >
        {lines}
      </form>
      <form class={styles.detail}
        label="detail"
        keys
        vi
      >
        <Detail item={paths[0]}>
        </Detail>
      </form>
        <box top="50%"
          left="50%"
          label="mock"
          height="50%"
          scrollable
          alwaysScroll
          border={
            {
              type: 'line',
            }
          }
          style={
            {
              bg: 'green',
            border:{ }
            }
          }
          >
          <box label="mock-template" height="50" left="2" top="6">mock</box>
        </box>
      </element>
      );
  }

}


export default App;
