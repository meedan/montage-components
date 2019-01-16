import React, { Component } from 'react';
import { react2angular } from 'react2angular';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
      VIDEO
      </div>
    );
  }
}

export default App;

export const AngularVideoTimeline = react2angular(App, []);
window.AngularVideoTimeline =  AngularVideoTimeline;
