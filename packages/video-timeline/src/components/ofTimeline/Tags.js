import React from 'react';

import AddIcon from '@material-ui/icons/Add';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import TableSection from './TableSection';

function TimelineTags(props) {
  return (
    <TableSection
      title="Tags"
      actions={
        <>
          <Tooltip title="Play Tags">
            <IconButton>
              <PlayArrowIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="New Tag">
            <IconButton>
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      }
    >
      Content
    </TableSection>
  );
}

export default TimelineTags;
