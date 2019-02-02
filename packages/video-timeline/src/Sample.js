import React, { Component } from 'react';
import { react2angular } from 'react2angular';

class Sample extends Component {
  render() {
    return (
      <div className="ReactSample">
        Sample React Component {this.props.foo}
      </div>
    );
  }
}

export default Sample;
export const AngularSample2 = react2angular(Sample, ['foo']);

window.AngularSample2 =  AngularSample2;