import React, { Component } from 'react';
import { withTheme } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player';

import { update } from '../reducers/player';

class Player extends Component {
  ref = player => {
    this.player = player;
  };

  componentDidUpdate(prevProps) {
    if (this.props.player.seekTo !== prevProps.player.seekTo) {
      if (this.player && !isNaN(this.props.player.seekTo)) {
        console.log('seeking', this.props.player.seekTo);
        this.player.seekTo(this.props.player.seekTo);
      }
    }
  }

  render() {
    const { player, update } = this.props;
    const { playing } = player;

    return (
      <ReactPlayer
        ref={this.ref}
        config={{
          youtube: {
            playerVars: {
              autoplay: 0,
            },
            preload: true,
          },
        }}
        url={`https://www.youtube.com/watch?v=${
          this.props.data.ytVideoData.id
        }`}
        progressInterval={200}
        controls
        volume={null}
        muted
        width="100%"
        height="100%"
        playing={playing}
        onPlay={() => update({ playing: true })}
        onPause={() => update({ playing: false })}
        onEnded={() => update({ playing: false })}
        onDuration={duration => update({ duration })}
        onProgress={({ playedSeconds }) =>
          update({ currentTime: playedSeconds })
        }
        onReady={() => console.info('onReady')}
        onStart={() => console.info('onStart')}
        onSeek={e => console.info('onSeek', e)}
        onError={e => console.error('onError', e)}
      />
    );
  }
}

export default connect(
  null,
  { update }
)(withTheme()(Player));
