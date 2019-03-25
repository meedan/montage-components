import React from 'react';

import { withStyles } from '@material-ui/core/styles';
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
    >
      Content
    </TableSection>
  );
}

export default withStyles()(TimelinePlaces);
