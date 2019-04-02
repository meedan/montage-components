import React from 'react';

import AddIcon from '@material-ui/icons/Add';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import TableSection from './TableSection';

function TimelineClips(props) {
  return (
    <TableSection
      title="Clips"
      actions={
        <>
          <Tooltip title="Play clips">
            <IconButton>
              <PlayArrowIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="New clip">
            <IconButton>
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      }
    />
  );
}


export default React.memo((props) => TimelineClips(props));
