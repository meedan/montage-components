import React from 'react';
import { withTheme } from '@material-ui/core/styles';

import ReactPlayer from 'react-player';


const Player = props => {
  const { data } = props;

  return (
    <ReactPlayer
      url={`https://www.youtube.com/watch?v=${data.ytVideoData.id}`}
      controls
      width='100%'
      height='100%'
    />
  );
};

export default withTheme()(Player);
