import React, {Component} from 'react';
import PropTypes from 'prop-types'

class Tags extends Component{
  render(){
    let {top,height,border,tags} = this.props;

    if(border){
      height += 2;
    }
    let items = this.props.items.map(tag=>tag.name)

    return (
      <listbar
      height={3}
      width="100%"
      keys={true}
      border={{type:'bg'}}
      style={{
        bg:'black',
        border:{
          fg:'black',
          bg:'black',
        },
        selected:{
          fg:'green',
          bg:'black',
        },
        item:{
          fg:'yellow',
          bg:'black',
        },
      }}
      items={items}
      >
      </listbar>
    );
  }
}

Tags.propTypes={
  //border: PropTypes.bool.isRequired,
  //top: PropTypes.number.isRequired,
  //height: PropTypes.number.isRequired,
  items: PropTypes.array.isRequired,
};

export default Tags;


