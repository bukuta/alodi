import React, {Component} from 'react';
import PropTypes from 'prop-types'

class Header extends Component{
  render(){
    let {width,height,border} = this.props;
    let {title,version,description} = this.props.info;

    if(border){
      height += 2;
    }


    return (
      <box
        width={width||'100%'}
        height={height||'100%'}
        border={{type:'line'}}
        style={{
          //border: {fg: 'blue'},
          //bg:'black',
          fg:'green'
        }}
        content={`${title}:${version}\n${description}`}
        >
      </box>
    );
  }
}

Header.propTypes={
  //border: PropTypes.bool.isRequired,
  //top: PropTypes.number.isRequired,
  //height: PropTypes.number.isRequired,
  info: PropTypes.object.isRequired,
};

export default Header;

