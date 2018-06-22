import React, {Component} from 'react';
import PropTypes from 'prop-types'

class Paths extends Component{
  render(){
    let {top,height,border,tags} = this.props;

    let items = this.props.items.map(([path,method,content])=>{
      return [method,path];
    });

    return (
      <listtable
        width="40%"
        scrollable={true}
        keys={true}
        align='left'
        border='line'
        style={{
          border:{
            fg:'green',
          },
          selected:{
            fg:'red',
          },
          item:{
            fg:'yellow',
          },
        }}
        rows={items}
        >
      </listtable>
    );
  }
}

Paths.propTypes={
  //border: PropTypes.bool.isRequired,
  //top: PropTypes.number.isRequired,
  //height: PropTypes.number.isRequired,
  items: PropTypes.array.isRequired,
};

export default Paths;



