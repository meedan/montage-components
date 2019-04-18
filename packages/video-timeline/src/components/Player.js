import React, { Component } from 'react';
import { withTheme } from '@material-ui/core/styles';

import ReactPlayer from 'react-player';


const NYAN = false;


class Player extends Component {
  state = {
    seeking: false,
    playing: false,
    progress: {},
  };

  static getDerivedStateFromProps(props, state) {
    return {
      playing: !!props.playing,
    };
  }

  onDuration = duration => {
    // console.log('onDuration', duration);
    this.setState({ duration });
    this.props.onDuration(duration);
  };

  onProgress = progress => {
    // console.log('onProgress', progress);
    this.setState({ progress });
    if (!this.state.seeking && !this.state.buffering) {
      this.props.onProgress(progress);
    }
  };

  onPlay = () => {
    // console.log('onPlay');
    this.setState({ playing: true, seeking: false, buffering: false });
    this.props.onPlay();
  };

  onPause = () => {
    // console.log('onPause');
    this.setState({ playing: false });
    this.props.onPause();
  };

  onSeek = () => {
    // console.log('onSeek');
    this.setState({ seeking: true });
  };

  onBuffer = () => {
    // console.log('onBuffer');
    this.setState({ buffering: true });
  };

  render() {
    return (
      <ReactPlayer
        ref={player => this.props.setPlayer(player)}
        url={`https://www.youtube.com/watch?v=${
          NYAN ? 'wZZ7oFKsKzY' : this.props.data.ytVideoData.id
        }`}
        controls
        width="100%"
        height="100%"
        onDuration={this.onDuration}
        onProgress={this.onProgress}
        onSeek={this.onSeek}
        onBuffer={this.onBuffer}
        onPlay={this.onPlay}
        onPause={this.onPause}
        playing={this.state.playing}
      />
    );
  }
}

export default withTheme()(Player);
