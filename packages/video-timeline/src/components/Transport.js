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
  padding-bottom: 16px;
  padding-top: 16px;
  text-align: center;
`;

const Transport = props => {
  const { player, currentTime, frameRate = 30, playing } = props;

  if (playing)
    return (
      <PlaybackControls>
        <Tooltip disableFocusListener title="Jump backward 5 seconds">
          <IconButton
            color="secondary"
            onClick={() => player.seekTo(currentTime - 5)}
          >
            <FastRewindIcon />
          </IconButton>
        </Tooltip>
        <Tooltip disableFocusListener title="Jump backward 1 second">
          <IconButton
            color="secondary"
            onClick={() => player.seekTo(currentTime - 1)}
          >
            <SkipPreviousIcon />
          </IconButton>
        </Tooltip>
        <IconButton
          color="secondary"
          key="playPause"
          onClick={() => props.playPause()}
        >
          <PauseIcon />
        </IconButton>
        <Tooltip disableFocusListener title="Jump forward 1 second">
          <IconButton
            color="secondary"
            onClick={() => player.seekTo(currentTime + 1)}
          >
            <SkipNextIcon />
          </IconButton>
        </Tooltip>
        <Tooltip disableFocusListener title="Jump forward 5 seconds">
          <IconButton
            color="secondary"
            onClick={() => player.seekTo(currentTime + 5)}
          >
            <FastForwardIcon />
          </IconButton>
        </Tooltip>
      </PlaybackControls>
    );

  return (
    <PlaybackControls>
      <Tooltip disableFocusListener title="Jump backward 1 second">
        <IconButton
          color="secondary"
          onClick={() => player.seekTo(currentTime - 1 / frameRate)}
        >
          <SkipPreviousIcon />
        </IconButton>
      </Tooltip>
      <IconButton
        key="playPause"
        color="secondary"
        onClick={() => props.playPause()}
      >
        <PlayArrowIcon />
      </IconButton>
      <Tooltip disableFocusListener title="Jump forward 1 second">
        <IconButton
          color="secondary"
          onClick={() => player.seekTo(currentTime + 1 / frameRate)}
        >
          <SkipNextIcon />
        </IconButton>
      </Tooltip>
    </PlaybackControls>
  );
};

export default withTheme()(Transport);
