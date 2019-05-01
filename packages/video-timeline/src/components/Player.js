import React, { Component } from 'react';
import { withTheme } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import ReactPlayer from 'react-player';

import { play, pause, duration, timeupdate, update } from '../reducers/player';

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

  handleOnReady = () => {
    const { update } = this.props;
    this.internalPlayer = this.player.getInternalPlayer();

    update({ playbackRates: this.internalPlayer.getAvailablePlaybackRates() });

    this.internalPlayer.addEventListener('onStateChange', ({ data: status }) =>
      update({ status })
    );

    this.internalPlayer.addEventListener(
      'onPlaybackRateChange',
      ({ data: playbackRate }) => update({ playbackRate })
    );
  };

  render() {
    const { player, play, pause, duration, timeupdate } = this.props;
    const { playing, playbackRate } = player;

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
        playbackRate={playbackRate}
        controls
        volume={null}
        muted
        width="100%"
        height="100%"
        playing={playing}
        onPlay={() => play()}
        onPause={() => pause()}
        onEnded={() => pause()}
        onDuration={d => duration(d)}
        onProgress={({ playedSeconds }) => timeupdate(playedSeconds)}
        onReady={this.handleOnReady}
        onStart={e => console.info('onStart', e)}
        onSeek={e => console.info('onSeek', e)}
        onError={e => console.error('onError', e)}
      />
    );
  }
}

export default connect(
  null,
  { play, pause, duration, timeupdate, update }
)(withTheme()(Player));
