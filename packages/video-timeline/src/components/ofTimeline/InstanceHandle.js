import React, { Component } from 'react';
import { Handle } from 'rc-slider';

import Tooltip from '@material-ui/core/Tooltip';

import formatTime from './formatTime';

class InstanceHandle extends Component {
  // constructor(props) {
  //   super(props);
  // }
  shouldComponentUpdate(nextProps) {
    return this.props.value !== nextProps.value ? true : false;
  }
  render() {
    const { value, index } = this.props;
    console.group('InstanceHandle');
    console.log(this.props);
    console.groupEnd();
    // return <span />;
    return (
      <Tooltip key={index} placement="top" title={formatTime(value)}>
        <Handle value={value} {...this.props} />
      </Tooltip>
    );
  }
}

export default InstanceHandle;
