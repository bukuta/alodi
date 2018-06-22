import React, {Component} from 'react';

import Header from './Header.js';
import Tags from './Tags.js';
import Paths from './Paths.js';

console.log(Header);

let spec = require('/Users/boyuan/devspace/private/api-docs/dist/index.json');

class App extends Component {
  constructor(){
    super(...arguments);
    this.state = {
      ...spec
    };
    //console.log(this.state);
  }

  render() {
    let title = this.state.info.title;
    let paths = [].concat.apply([],(Object.entries(this.state.paths)
      .map(([path,item])=>{
        return Object.entries(item).map(([method,content])=>{
          return [path,method,content];
        });
      })));


    return (
      <layout top="0"
           left="0"
           width="100%"
           height="100%"
           //border={{type: 'line'}}
           style={{
             //border: {fg: 'blue'},
             //bg:'black',
             fg:'green'
           }}>
           <Header height={4} info={this.state.info} />
           <Tags items={this.state.tags} />

           <listbar height={3} width="100%" keys={true} items={['get','post','put','delete','patch','head']} />

           <Paths items={paths} />

      </layout>
    );
  }
}
//<list keys={true} height={10} width="100%" items={this.state.tags.map(tag=>tag.name)}>
//</list>

//<layout scrollable keys={true} bottom={0} width={'30%'} border={{type:"line"}} >
             //{
               //Object.entries(paths).map(([path,item])=>
                 //Object.entries(item).map(([method, content])=>
                 //{
                   //return <box key={`${method}-${path}`} width="100%" content={`[${method}] ${path}`}></box>
                 //}
               //)
               //)
             //}
             //<box><text>last</text></box>
           //</layout>
           //<layout bottom="0" width="70%">
             //<listtable data={this.state.tags.map(tag=>[tag.name,tag.description])}>
             //</listtable>
             //<box label="content2" scrollable height={20} width={'100%'} border={{type:"line"}} content="content2"></box>
             //<box scrollable iheight={20} width={'100%'} border={{type:"line"}} content="content3"></box>
           //</layout>

export default App;
