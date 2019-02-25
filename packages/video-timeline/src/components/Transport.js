import React from 'react';
import { withTheme } from '@material-ui/core/styles';

import FastRewindIcon from '@material-ui/icons/FastRewind';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import FastForwardIcon from '@material-ui/icons/FastForward';

import IconButton from '@material-ui/core/IconButton';



const Transport = props => {
  const { player, duration, currentTime, frameRate = 30, playing } = props;

  if (playing) return (
    <div>
      <IconButton>
        <FastRewindIcon onClick={() => player.seekTo(currentTime - 5)} />
      </IconButton>
      <IconButton>
        <SkipPreviousIcon onClick={() => player.seekTo(currentTime - 1)} />
      </IconButton>
      <IconButton key="playPause">
        <PauseIcon onClick={() => props.playPause()} />
      </IconButton>
      <IconButton>
        <SkipNextIcon onClick={() => player.seekTo(currentTime + 1)} />
      </IconButton>
      <IconButton>
        <FastForwardIcon onClick={() => player.seekTo(currentTime + 5)} />
      </IconButton>
    </div>
  );

  return (
    <div>
      <IconButton>
        <SkipPreviousIcon onClick={() => player.seekTo(currentTime - 1 / frameRate)} />
      </IconButton>
      <IconButton key="playPause">
        <PlayArrowIcon onClick={() => props.playPause()} />
      </IconButton>
      <IconButton>
        <SkipNextIcon onClick={() => player.seekTo(currentTime + 1 / frameRate)} />
      </IconButton>
    </div>
  );
};

export default withTheme()(Transport);
