import React, { Component } from 'react';
import { withTheme } from '@material-ui/core/styles';

import ReactPlayer from 'react-player';

class Player extends Component {
  state = {};

  static getDerivedStateFromProps(props, state) {
    return {
      playing: !!props.playing,
    };
  }

  onDuration = duration => {
    console.log('onDuration', duration);
    this.setState({ duration });
    this.props.onDuration(duration);
  };

  onProgress = state => {
    console.log('onProgress', state);
    if (!this.state.seeking) {
      this.setState(state);
      this.props.onProgress(state);
    }
  };

  onPlay = () => {
    console.log('onPlay');
    this.setState({ playing: true });
    this.props.onPlay();
  };

  onPause = () => {
    console.log('onPause');
    this.setState({ playing: false });
    this.props.onPause();
  };

  render() {
    return (
      <ReactPlayer
        ref={player => this.props.setPlayer(player)}
        url={`https://www.youtube.com/watch?v=${
          this.props.data.ytVideoData.id
        }`}
        controls
        width="100%"
        height="100%"
        onDuration={this.onDuration}
        onProgress={this.onProgress}
        onPlay={this.onPlay}
        onPause={this.onPause}
        playing={this.state.playing}
      />
    );
  }
}

export default withTheme()(Player);
