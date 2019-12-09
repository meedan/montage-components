import React from 'react';
import styled from 'styled-components';

import { withTheme } from '@material-ui/core/styles';
import FastForwardIcon from '@material-ui/icons/FastForward';
import FastRewindIcon from '@material-ui/icons/FastRewind';
import IconButton from '@material-ui/core/IconButton';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import Tooltip from '@material-ui/core/Tooltip';

const PlaybackControls = styled.div`
  text-align: center;
`;

const Transport = props => {
  const { update, playing, seekTo, frameRate = 30, currentTime } = props;

  if (playing)
    return (
      <PlaybackControls>
        <Tooltip disableFocusListener title="Jump backward 5 seconds">
          <IconButton color="inherit" onClick={() => seekTo({ seekTo: currentTime - 5, transport: 'transport' })}>
            <FastRewindIcon />
          </IconButton>
        </Tooltip>
        <Tooltip disableFocusListener title="Jump backward 1 second">
          <IconButton color="inherit" onClick={() => seekTo({ seekTo: currentTime - 1, transport: 'transport' })}>
            <SkipPreviousIcon />
          </IconButton>
        </Tooltip>
        <IconButton color="inherit" key="playPause" onClick={() => update({ playing: false, transport: 'transport' })}>
          <PauseIcon />
        </IconButton>
        <Tooltip disableFocusListener title="Jump forward 1 second">
          <IconButton color="inherit" onClick={() => seekTo({ seekTo: currentTime + 1, transport: 'transport' })}>
            <SkipNextIcon />
          </IconButton>
        </Tooltip>
        <Tooltip disableFocusListener title="Jump forward 5 seconds">
          <IconButton color="inherit" onClick={() => seekTo({ seekTo: currentTime + 5, transport: 'transport' })}>
            <FastForwardIcon />
          </IconButton>
        </Tooltip>
      </PlaybackControls>
    );

  return (
    <PlaybackControls>
      <Tooltip disableFocusListener title="Jump backward 1 frame">
        <IconButton
          color="inherit"
          onClick={() =>
            seekTo({
              seekTo: currentTime - 1 / frameRate,
              transport: 'transport',
            })
          }>
          <SkipPreviousIcon />
        </IconButton>
      </Tooltip>
      <IconButton key="playPause" color="inherit" onClick={() => update({ playing: true, transport: 'transport' })}>
        <PlayArrowIcon />
      </IconButton>
      <Tooltip disableFocusListener title="Jump forward 1 frame">
        <IconButton
          color="inherit"
          onClick={() =>
            seekTo({
              seekTo: currentTime + 1 / frameRate,
              transport: 'transport',
            })
          }>
          <SkipNextIcon />
        </IconButton>
      </Tooltip>
    </PlaybackControls>
  );
};

export default withTheme(Transport);
