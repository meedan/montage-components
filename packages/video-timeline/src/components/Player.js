import React, { Component } from 'react';
import { withTheme } from '@material-ui/core/styles';
import ReactPlayer from 'react-player';

class Player extends Component {
  ref = player => {
    this.player = player;
  };

  handleOnReady = () => {
    const { update } = this.props;

    this.internalPlayer = this.player.getInternalPlayer();
    window.internalPlayer = this.internalPlayer; // FIXME

    update({ playbackRates: this.internalPlayer.getAvailablePlaybackRates() });
    this.internalPlayer.addEventListener('onStateChange', ({ data: status }) => update({ status }));
    this.internalPlayer.addEventListener('onPlaybackRateChange', ({ data: playbackRate }) => update({ playbackRate }));
  };

  render() {
    const { update, playing, playbackRate } = this.props;

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
        url={this.props.url}
        progressInterval={200}
        playbackRate={playbackRate}
        controls
        volume={null}
        muted
        width="100%"
        height="400px"
        playing={playing}
        onPlay={() => update({ playing: true })}
        onPause={() => update({ playing: false })}
        onEnded={() => update({ playing: true })}
        onDuration={duration => update({ duration })}
        onProgress={({ playedSeconds: currentTime }) => update({ currentTime })}
        onReady={this.handleOnReady}
        onStart={e => console.info('onStart', e)}
        onSeek={e => console.info('onSeek', e)}
        onError={e => console.error('onError', e)}
      />
    );
  }
}

export default withTheme(Player);
