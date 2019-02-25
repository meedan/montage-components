import React from 'react';
import { withTheme } from '@material-ui/core/styles';

import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';

import IconButton from '@material-ui/core/IconButton';



const Transport = props => {
  return (
    <div>
      <IconButton aria-label="Previous">
        {props.theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
      </IconButton>
      <IconButton aria-label="Play/pause">
        <PlayArrowIcon />
      </IconButton>
      <IconButton aria-label="Next">
        {props.theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
      </IconButton>
    </div>
  );
};

export default withTheme()(Transport);
