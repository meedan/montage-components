import React from 'react';

import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import TableSection from './TableSection';

function TimelinePlaces(props) {
  return (
    <TableSection
      title="Places"
      actions={
        <>
          <Tooltip title="New Place">
            <IconButton>
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      }
    />
  );
}

export default TimelinePlaces;
