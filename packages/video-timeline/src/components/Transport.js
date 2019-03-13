import React from 'react';
import styled from 'styled-components';

import { setSpace } from '@montage/ui';

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
  ${setSpace('pvm')};
  text-align: center;
`;

const Transport = props => {
  const { player, currentTime, frameRate = 30, playing } = props;

  if (playing)
    return (
      <PlaybackControls>
        <Tooltip disableFocusListener title="Jump backward 5 seconds">
          <IconButton color="secondary">
            <FastRewindIcon onClick={() => player.seekTo(currentTime - 5)} />
          </IconButton>
        </Tooltip>
        <Tooltip disableFocusListener title="Jump backward 1 second">
          <IconButton color="secondary">
            <SkipPreviousIcon onClick={() => player.seekTo(currentTime - 1)} />
          </IconButton>
        </Tooltip>
        <IconButton key="playPause" color="secondary">
          <PauseIcon onClick={() => props.playPause()} />
        </IconButton>
        <Tooltip disableFocusListener title="Jump forward 1 second">
          <IconButton color="secondary">
            <SkipNextIcon onClick={() => player.seekTo(currentTime + 1)} />
          </IconButton>
        </Tooltip>
        <Tooltip disableFocusListener title="Jump forward 5 seconds">
          <IconButton color="secondary">
            <FastForwardIcon onClick={() => player.seekTo(currentTime + 5)} />
          </IconButton>
        </Tooltip>
      </PlaybackControls>
    );

  return (
    <PlaybackControls>
      <Tooltip disableFocusListener title="Jump backward 1 second">
        <IconButton color="secondary">
          <SkipPreviousIcon
            onClick={() => player.seekTo(currentTime - 1 / frameRate)}
          />
        </IconButton>
      </Tooltip>
      <IconButton key="playPause" color="secondary">
        <PlayArrowIcon onClick={() => props.playPause()} />
      </IconButton>
      <Tooltip disableFocusListener title="Jump forward 1 second">
        <IconButton color="secondary">
          <SkipNextIcon
            onClick={() => player.seekTo(currentTime + 1 / frameRate)}
          />
        </IconButton>
      </Tooltip>
    </PlaybackControls>
  );
};

export default withTheme()(Transport);
