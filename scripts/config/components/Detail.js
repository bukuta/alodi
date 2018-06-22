const debug = require('debug')('detail');
import React, { Component } from 'react';
import blessed from 'blessed';
import { render } from 'react-blessed';

class Detail extends Component{
  constructor(){
    super(...arguments);
  }

  render(){
    let item = this.props.item;
    debug('item',item);
    return (
      <form class={styles.detail} top={0} >
      <scrollablebox>
        <box>{'method: '+item.method}</box>
        <box>{'tags: '+item.tags.map(t=>t.name).join(',')}</box>
      </scrollablebox>
      </form>
    );
  }
}

const styles = {
  detail:{
    width: '100%-2',
    bg: 'black',
  }
};

export default Detail;
